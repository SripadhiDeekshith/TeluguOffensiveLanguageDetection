from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from functools import wraps
import os
import re
import pickle
import numpy as np
np.core._ = None
import logging

from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate
from indicnlp.tokenize import indic_tokenize
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import tensorflow as tf

import security

# Flask App Configuration
app = Flask(__name__, static_folder="build", static_url_path="/")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///twitter.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "some_secret_key"

# Suppress verbose logs
logging.getLogger('werkzeug').setLevel(logging.WARNING)
tf.autograph.set_verbosity(0)
tf.get_logger().setLevel('ERROR')

# Initialize extensions
db = SQLAlchemy(app)
CORS(app, supports_credentials=True)

class User(db.Model):
    """User model for authentication."""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(24))
    email = db.Column(db.String(64))
    pwd = db.Column(db.String(64))
        
    def __init__(self, username, email, pwd):
        self.username = username
        self.email = email
        self.pwd = pwd

class Tweet(db.Model):
    """Tweet model storing content and offensiveness flag."""
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship('User', foreign_keys=uid)
    title = db.Column(db.String(256))
    content = db.Column(db.String(2048))
    is_offensive = db.Column(db.Boolean, default=False)

def transliterate_roman_to_telugu(text):
    """Convert ITRANS Romanized Telugu to Telugu script."""
    if re.search(r'[\u0C00-\u0C7F]', text):
        return text
    try:
        return transliterate(text, sanscript.ITRANS, sanscript.TELUGU)
    except Exception as e:
        print(f"Transliteration error: {e}")
        return text

def telugu_preprocessor(text):
    """Remove non-Telugu chars and tokenize Telugu text."""
    cleaned = re.sub(r'[^\u0C00-\u0C7F]', ' ', str(text))
    tokens = indic_tokenize.trivial_tokenize(cleaned)
    return ' '.join(tokens)

def getUsers():
    """Return all users."""
    users = User.query.all()
    return [
        {"id": u.id, "username": u.username, "email": u.email, "password": u.pwd}
        for u in users
    ]

def getUser(uid):
    """Return a single user by ID."""
    u = db.session.get(User, uid)
    return {"id": u.id, "username": u.username, "email": u.email, "password": u.pwd}

def addUser(username, email, pwd):
    """Create a new user."""
    try:
        u = User(username, email, pwd)
        db.session.add(u)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False

def removeUser(uid):
    """Delete a user by ID."""
    try:
        u = User.query.get(uid)
        db.session.delete(u)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False

def getTweets():
    """Return all tweets."""
    tweets = Tweet.query.all()
    return [
        {
            "id": t.id,
            "title": t.title,
            "content": t.content,
            "user": getUser(t.uid),
            "is_offensive": t.is_offensive
        }
        for t in tweets
    ]

def addTweet(title, content, uid, is_offensive=False):
    """Create a new tweet."""
    try:
        user = db.session.get(User, uid)
        if not user:
            return False
        twt = Tweet(title=title, content=content, user=user, is_offensive=is_offensive)
        db.session.add(twt)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False

def delTweet(tid):
    """Delete a tweet by ID."""
    try:
        t = db.session.get(Tweet, tid)
        db.session.delete(t)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False

class ModelBank:
    """Loads and manages ML/DL models for offensive language detection."""

    def __init__(self, model_dir="models"):
        self.model_dir = model_dir
        self.tf_models = []
        self.sklearn_models = []
        self.vectorizer = None
        self.tokenizer = None
        self.max_len = 100

        if not os.path.exists(self.model_dir):
            raise FileNotFoundError(f"Model directory '{self.model_dir}' not found")
        self.load_assets()

    def load_assets(self):
        """Load vectorizer, tokenizer, and all models."""
        class ForcedUnpickler(pickle.Unpickler):
            def find_class(self, module, name):
                if module.startswith("numpy._core"):
                    module = module.replace("numpy._core", "numpy.core")
                return super().find_class(module, name)

        vec_path = os.path.join(self.model_dir, "tfidf_vectorizer.pkl")
        tok_path = os.path.join(self.model_dir, "dl_tokenizer.pkl")

        if os.path.exists(vec_path):
            with open(vec_path, "rb") as f:
                self.vectorizer = ForcedUnpickler(f).load()

        if os.path.exists(tok_path):
            with open(tok_path, "rb") as f:
                data = ForcedUnpickler(f).load()
                self.tokenizer = data["tokenizer"]
                self.max_len = data.get("max_len", 100)

        for fname in os.listdir(self.model_dir):
            path = os.path.join(self.model_dir, fname)
            if fname.endswith(".h5"):
                try:
                    m = load_model(path)
                    m._name = os.path.splitext(fname)[0]
                    self.tf_models.append(m)
                except Exception as e:
                    print(f"Error loading {fname}: {e}")
            elif fname.endswith(".pkl") and "model" in fname:
                try:
                    with open(path, "rb") as f:
                        self.sklearn_models.append(ForcedUnpickler(f).load())
                except Exception as e:
                    print(f"Error loading {fname}: {e}")

    def preprocess_for_dl(self, text):
        """Tokenize and pad text for DL models."""
        seq = self.tokenizer.texts_to_sequences([text])
        return pad_sequences(seq, maxlen=self.max_len, dtype='int32')

    def predict(self, text):
        """Vote across all models to determine offensiveness."""
        off_votes = non_votes = total = 0
        print("\n--- Model Voting Results ---")

        if self.vectorizer:
            tfidf = self.vectorizer.transform([text])
            for m in self.sklearn_models:
                try:
                    p = m.predict(tfidf)[0]
                    vote = "Offensive" if p == "hate" else "Non-Offensive"
                    off_votes += int(p == "hate")
                    non_votes += int(p != "hate")
                    print(f"| {type(m).__name__:25} | {vote:15} |")
                    total += 1
                except Exception as e:
                    print(f"| {type(m).__name__:25} | Error: {str(e)[:10]} |")

        if self.tokenizer:
            seq = self.preprocess_for_dl(text)
            for m in self.tf_models:
                try:
                    p = (m.predict(seq, verbose=0) > 0.5).astype(int)[0][0]
                    vote = "Offensive" if p == 0 else "Non-Offensive"
                    off_votes += int(p == 0)
                    non_votes += int(p == 1)
                    print(f"| {m.name:25} | {vote:15} |")
                    total += 1
                except Exception as e:
                    print(f"| {m.name:25} | Error: {str(e)[:10]} |")

        print(f"\nSummary:\nOffensive Votes: {off_votes}\nNon-Offensive Votes: {non_votes}\nTotal Models Participated: {total}\n" + "-"*40 + "\n")
        return off_votes

# Instantiate the model bank
model_bank = ModelBank(model_dir="models")

def login_required(f):
    """Ensure endpoint is accessed by authenticated users."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    return wrapper

@app.route("/<path:path>")
def react_routes(path):
    """Serve React app for all non-API routes."""
    return app.send_static_file("index.html")

@app.route("/")
def react_index():
    """Serve React entry point."""
    return app.send_static_file("index.html")

@app.route("/api/login", methods=["POST"])
def login():
    """Authenticate user and start session."""
    try:
        email = request.json.get("email", "")
        pwd = request.json.get("pwd", "")
        users = getUsers()
        user = next(
            (u for u in users if security.dec(u["email"]) == email and security.checkpwd(pwd, u["password"])),
            None
        )
        if user:
            session["user_id"] = str(user["id"])
            return jsonify({"success": True})
        return jsonify({"error": "Invalid credentials"})
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid form"})

@app.route("/api/register", methods=["POST"])
def register():
    """Register a new user."""
    try:
        email = request.json.get("email", "").lower()
        pwd_enc = security.encpwd(request.json.get("pwd", ""))
        username = request.json.get("username", "")
        if not (email and pwd_enc and username):
            return jsonify({"error": "Invalid form"})
        if any(security.dec(u["email"]) == email for u in getUsers()):
            return jsonify({"error": "User already exists"})
        if not re.match(r"[\w._]{5,}@\w{3,}\.\w{2,4}", email):
            return jsonify({"error": "Invalid email"})
        addUser(username, security.enc(email), pwd_enc)
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid form"})

@app.route("/api/logout", methods=["POST"])
@login_required
def logout():
    """Clear user session."""
    session.clear()
    return jsonify({"success": True})

@app.route("/api/tweets")
def list_tweets():
    """Return all tweets."""
    return jsonify(getTweets())

@app.route("/api/addtweet", methods=["POST"])
@login_required
def add_tweet():
    """Add a tweet with offensiveness check."""
    try:
        title = request.json.get("title", "").strip()
        raw = request.json.get("content", "").strip()
        clean = re.sub(r'<[^>]+>', '', raw).strip()
        translit = transliterate_roman_to_telugu(clean)
        if not (title and clean):
            return jsonify({"error": "Invalid form"}), 422
        votes = model_bank.predict(translit)
        is_off = votes >= 5
        uid = session.get("user_id")
        if addTweet(title, raw, uid, is_off):
            return jsonify({"success": True})
        return jsonify({"error": "Could not add tweet"}), 400
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid form"}), 422

@app.route("/api/deletetweet/<int:tid>", methods=["DELETE"])
@login_required
def delete_tweet(tid):
    """Delete a tweet."""
    try:
        if delTweet(tid):
            return jsonify({"success": True})
        return jsonify({"error": "Could not delete tweet"}), 400
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid form"}), 422

@app.route("/api/getcurrentuser")
@login_required
def get_current_user():
    """Return current user details."""
    uid = session.get("user_id")
    return jsonify(getUser(uid))

@app.route("/api/changepassword", methods=["POST"])
@login_required
def change_password():
    """Change logged-in user’s password."""
    try:
        uid = session.get("user_id")
        user = db.session.get(User, uid)
        old = request.json.get("password", "")
        new = request.json.get("npassword", "")
        if not (old and new):
            return jsonify({"error": "Invalid form"}), 422
        if not security.checkpwd(old, user.pwd):
            return jsonify({"error": "Wrong password"}), 422
        user.pwd = new
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid form"}), 422

@app.route("/api/deleteaccount", methods=["DELETE"])
@login_required
def delete_account():
    """Delete user account and all their tweets."""
    try:
        uid = session.get("user_id")
        for t in Tweet.query.filter_by(uid=uid).all():
            delTweet(t.id)
        removeUser(uid)
        session.clear()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 422

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
