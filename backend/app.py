from dotenv import load_dotenv
load_dotenv()
from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import re
import security  
from functools import wraps
import os
import pickle
import numpy as np
np.core._ = None
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from indicnlp.tokenize import indic_tokenize
import logging

app = Flask(__name__, static_folder="build", static_url_path="/")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///twitter.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "some_secret_key"  
logging.getLogger('werkzeug').setLevel(logging.WARNING)
db = SQLAlchemy(app)
CORS(app, supports_credentials=True)

def telugu_preprocessor(text):
        text = re.sub(r'[^\u0C00-\u0C7F]', ' ', str(text))  
        tokens = indic_tokenize.trivial_tokenize(text)  
        return ' '.join(tokens)

class ModelBank:
    def __init__(self, model_dir="models"):
        self.model_dir = model_dir
        self.tf_models = []
        self.sklearn_models = []
        self.vectorizer = None
        self.tokenizer = None
        self.max_len = 100
        
        # Verify model directory exists
        if not os.path.exists(self.model_dir):
            raise FileNotFoundError(f"Model directory '{self.model_dir}' not found")
            
        self.load_assets()

    

    def load_assets(self):
        
        class ForcedUnpickler(pickle.Unpickler):
            def find_class(self, module, name):
                # Fix numpy core references
                if module.startswith("numpy._core"):
                    module = module.replace("numpy._core", "numpy.core")
                return super().find_class(module, name)

        # Load preprocessing files
        vectorizer_path = os.path.join(self.model_dir, "tfidf_vectorizer.pkl")
        tokenizer_path = os.path.join(self.model_dir, "dl_tokenizer.pkl")
        
        if os.path.exists(vectorizer_path):
            with open(vectorizer_path, "rb") as f:
                self.vectorizer = ForcedUnpickler(f).load()
                
        if os.path.exists(tokenizer_path):
            with open(tokenizer_path, "rb") as f:
                tokenizer_data = ForcedUnpickler(f).load()
                self.tokenizer = tokenizer_data["tokenizer"]
                self.max_len = tokenizer_data.get("max_len", 100)

        # Load models
        for file in os.listdir(self.model_dir):
            file_path = os.path.join(self.model_dir, file)
            
            if file.endswith(".h5"):
                try:
                    model = load_model(file_path)
                    model_name = os.path.splitext(file)[0]  
                    model._name = model_name
                    self.tf_models.append(model)
                except Exception as e:
                    print(f"Error loading {file}: {str(e)}")
                    
            elif file.endswith(".pkl") and "model" in file:
                try:
                    with open(file_path, "rb") as f:
                        model = ForcedUnpickler(f).load()
                        self.sklearn_models.append(model)
                except Exception as e:
                    print(f"Error loading {file}: {str(e)}")

    def preprocess_for_dl(self, text):
        sequences = self.tokenizer.texts_to_sequences([text])
        padded = pad_sequences(sequences, maxlen=self.max_len, dtype='int32')
        return padded

    def predict(self, text):
        offensive_votes = 0
        non_offensive_votes = 0
        total_votes = 0
        
        print("\n--- Model Voting Results ---")
        
        # Traditional Models
        if self.vectorizer:
            tfidf_text = self.vectorizer.transform([text])
            for model in self.sklearn_models:
                try:
                    pred = model.predict(tfidf_text)[0]
                    model_name = type(model).__name__
                    vote = "Offensive" if pred == "hate" else "Non-Offensive"
                    offensive_votes += 1 if pred == "hate" else 0
                    non_offensive_votes += 0 if pred == "hate" else 1
                    print(f"| {model_name:25} | {vote:15} |")
                    total_votes += 1
                except Exception as e:
                    print(f"| {model_name:25} | Error: {str(e)[:10]} |")

        # Deep Learning Models
        if self.tokenizer:
            dl_seq = self.preprocess_for_dl(text)
            for model in self.tf_models:
                try:
                    pred = (model.predict(dl_seq, verbose=0) > 0.5).astype(int)[0][0]
                    model_name = model.name
                    vote = "Offensive" if pred == 0 else "Non-Offensive"
                    if pred == 0:
                        offensive_votes += 1
                    else:
                        non_offensive_votes += 1
                    print(f"| {model_name:25} | {vote:15} |")
                    total_votes += 1
                except Exception as e:
                    print(f"| {model_name:25} | Error: {str(e)[:10]} |")

        # Print summary table
        print(f"\nSummary:")
        print(f"Offensive Votes: {offensive_votes}")
        print(f"Non-Offensive Votes: {non_offensive_votes}")
        print(f"Total Models Participated: {total_votes}")
        print("-" * 40 + "\n")
        
        return int(offensive_votes)

# Initialize with single model directory
model_bank = ModelBank(model_dir="models")

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(24))
    email = db.Column(db.String(64))
    pwd = db.Column(db.String(64))

    def __init__(self, username, email, pwd):
        self.username = username
        self.email = email
        self.pwd = pwd

class Tweet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship('User', foreign_keys=uid)
    title = db.Column(db.String(256))
    content = db.Column(db.String(2048))

def getUsers():
    users = User.query.all()
    return [{"id": i.id, "username": i.username, "email": i.email, "password": i.pwd} for i in users]

def getUser(uid):
    user = User.query.get(uid)
    return {"id": user.id, "username": user.username, "email": user.email, "password": user.pwd}

def addUser(username, email, pwd):
    try:
        user = User(username, email, pwd)
        db.session.add(user)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False

def removeUser(uid):
    try:
        user = User.query.get(uid)
        db.session.delete(user)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False

def getTweets():
    tweets = Tweet.query.all()
    return [{"id": i.id, "title": i.title, "content": i.content, "user": getUser(i.uid)} for i in tweets]

def addTweet(title, content, uid):
    try:
        user = User.query.get(uid)
        if not user:
            return False
        twt = Tweet(title=title, content=content, user=user)
        db.session.add(twt)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False

def delTweet(tid):
    try:
        tweet = Tweet.query.get(tid)
        db.session.delete(tweet)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False

def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Authentication required"}), 401
        return func(*args, **kwargs)
    return wrapper

@app.route("/<a>")
def react_routes(a):
    return app.send_static_file("index.html")

@app.route("/")
def react_index():
    return app.send_static_file("index.html")

@app.route("/api/login", methods=["POST"])
def login():
    try:
        email = request.json["email"]
        password = request.json["pwd"]
        if email and password:
            users = getUsers()
            user = [u for u in users if security.dec(u["email"]) == email and security.checkpwd(password, u["password"])]
            if len(user) == 1:
                session["user_id"] = str(user[0]["id"])
                return jsonify({"success": True})
            else:
                return jsonify({"error": "Invalid credentials"})
        else:
            return jsonify({"error": "Invalid form"})
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid form"})

@app.route("/api/register", methods=["POST"])
def register():
    try:
        email = request.json["email"].lower()
        password = security.encpwd(request.json["pwd"])
        username = request.json["username"]
        if not (email and password and username):
            return jsonify({"error": "Invalid form"})
        users = getUsers()
        if any(security.dec(u["email"]) == email for u in users):
            return jsonify({"error": "User already exists"})
        if not re.match(r"[\w._]{5,}@\w{3,}\.\w{2,4}", email):
            return jsonify({"error": "Invalid email"})
        addUser(username, security.enc(email), password)
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid form"})

@app.route("/api/logout", methods=["POST"])
@login_required
def logout():
    session.clear()
    return jsonify({"success": True})

@app.route("/api/tweets")
def get_tweets():
    return jsonify(getTweets())

@app.route("/api/addtweet", methods=["POST"])
@login_required
def add_tweet():
    try:
        title = request.json.get("title", "").strip()
        raw_content = request.json.get("content", "").strip()
        
        clean_content = re.sub('<[^<]+?>', '', raw_content).strip()
        if not (title and clean_content):
            return jsonify({"error": "Invalid form"}), 422
        
        offensive_votes = model_bank.predict(clean_content)
        total_models = len(model_bank.tf_models) + len(model_bank.sklearn_models)
        
        if offensive_votes >= 5:
            return jsonify({
                "error": "This content appears to be offensive and cannot be posted",
                "offensive_votes": offensive_votes,
                "total_models": total_models
            }), 400
        
        uid = session.get("user_id")
        if addTweet(title, raw_content, uid):
            return jsonify({"success": True})
        else:
            return jsonify({"error": "Could not add tweet"}), 400
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid form"}), 422

@app.route("/api/deletetweet/<tid>", methods=["DELETE"])
@login_required
def delete_tweet(tid):
    try:
        if delTweet(tid):
            return jsonify({"success": True})
        else:
            return jsonify({"error": "Could not delete tweet"}), 400
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid form"}), 422

@app.route("/api/getcurrentuser")
@login_required
def get_current_user():
    uid = session.get("user_id")
    return jsonify(getUser(uid))

@app.route("/api/changepassword", methods=["POST"])
@login_required
def change_password():
    try:
        uid = session.get("user_id")
        user = User.query.get(uid)
        if not (request.json["password"] and request.json["npassword"]):
            return jsonify({"error": "Invalid form"}), 422
        if not security.checkpwd(request.json["password"], user.pwd):
            return jsonify({"error": "Wrong password"}), 422
        user.pwd = request.json["npassword"]
        db.session.add(user)
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid form"}), 422

@app.route("/api/deleteaccount", methods=["DELETE"])
@login_required
def delete_account():
    try:
        uid = session.get("user_id")
        user = User.query.get(uid)
        tweets = Tweet.query.filter(Tweet.uid == uid).all()
        for tweet in tweets:
            delTweet(tweet.id)
        removeUser(user.id)
        session.clear()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 422

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)