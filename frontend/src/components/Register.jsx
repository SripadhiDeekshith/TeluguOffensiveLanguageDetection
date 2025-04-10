import React, { Component } from "react";
import axios from "axios";
import Alert from "./Alert";
import { check } from "../login";

/**
 * Register component handles user registration.
 * - Redirects to home if already logged in.
 * - Submits email, username, and password to server.
 */
class Register extends Component {
  state = { err: "" };

  /**
   * On mount, verify existing session; redirect if logged in.
   */
  componentDidMount() {
    check().then(isLoggedIn => {
      if (isLoggedIn) window.location.href = "/";
    });
  }

  /**
   * Handle form submission: register user and handle errors.
   */
  handleSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const pwd = document.getElementById("password").value;

    axios.post("/api/register", { email, username, pwd })
      .then(res => {
        if (res.data.error) {
          this.setState({ err: res.data.error });
        } else {
          window.location.href = "/login";
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({ err: "Registration failed. Please try again." });
      });
  };

  render() {
    const { err } = this.state;

    return (
      <div style={styles.pageContainer}>
        <div style={styles.cardContainer}>
          <header style={styles.header}>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.subtitle}>Get started with your free account</p>
          </header>

          <div style={styles.formContainer}>
            {err && (
              <Alert
                message={`Check your form and try again! (${err})`}
                style={styles.alert}
              />
            )}

            <form onSubmit={this.handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label htmlFor="email" style={styles.label}>Email</label>
                <input
                  type="email"
                  id="email"
                  style={styles.input}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="username" style={styles.label}>Username</label>
                <input
                  type="text"
                  id="username"
                  style={styles.input}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <input
                  type="password"
                  id="password"
                  style={styles.input}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" style={styles.button}>
                Create Account
              </button>
            </form>

            <footer style={styles.footer}>
              <p style={styles.footerText}>
                Already have an account? <a href="/login" style={styles.link}>Sign in</a>
              </p>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;

// -------------------------
// Style Constants
// -------------------------
const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: "'Inter', sans-serif"
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    width: '100%',
    maxWidth: '400px',
    overflow: 'hidden',
    margin: '10rem auto 2rem'
  },
  header: {
    padding: '2rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    color: 'white',
    textAlign: 'center'
  },
  title: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: '700'
  },
  subtitle: {
    margin: '0.5rem 0 0',
    fontSize: '0.9rem',
    opacity: 0.9
  },
  formContainer: {
    padding: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    color: '#374151',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  button: {
    width: '100%',
    padding: '0.875rem',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center'
  },
  footerText: {
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  link: {
    color: '#6366f1',
    fontWeight: '600',
    textDecoration: 'none'
  },
  alert: {
    marginBottom: '1.5rem'
  }
};
