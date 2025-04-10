import React from 'react';
import Alert from "./Alert";
import Axios from "axios";
import './UserSettings.css';

/**
 * UserSettings component for managing user account settings.
 * - Change password
 * - Delete account
 * - Handles navigation between settings sections
 */
class UserSettings extends React.Component {
  state = { currentSetting: "main", err: "" };

  /**
   * On mount, check if user is logged in.
   * Redirect to login page if not authenticated.
   */
  componentDidMount() {
    Axios.get("/api/getcurrentuser", { withCredentials: true })
      .catch(() => window.location = "/login");
  }

  /**
   * Handle password change submission.
   */
  changePassword = (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const npassword = document.getElementById("npassword").value;

    Axios.post("/api/changepassword", { password, npassword }, { withCredentials: true })
      .then(res => {
        if (res.data.error) {
          this.setState({ err: res.data.error });
        } else {
          alert("Password changed! Logging you out...");
          window.location = "/logout";
        }
      });
  };

  /**
   * Handle account deletion with confirmation.
   */
  deleteAccount = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete your account? THIS CANNOT BE UNDONE. ALL OF YOUR POSTS WILL BE DELETED")) {
      Axios.delete("/api/deleteaccount", { withCredentials: true })
        .then(res => {
          if (res.data.error) {
            alert("An error occurred: " + res.data.error);
          } else {
            alert("Your account has been deleted. We're sad to see you go. Logging you out...");
            window.location = "/logout";
          }
        });
    }
  };

  render() {
    const { currentSetting, err } = this.state;

    return (
      <div className="user-settings-container">
        <div className="settings-card">
          <header className="settings-header">
            <h1>Account Settings</h1>
          </header>

          <div className="settings-content">
            {err && <Alert message={err} />}

            {currentSetting === "main" && (
              <div className="main-settings">
                <div className="settings-header-section">
                  <h2>Manage Your Account</h2>
                  <p>Update your security settings</p>
                </div>

                <div className="settings-options">
                  <button
                    onClick={() => this.setState({ currentSetting: "cpwd" })}
                    className="settings-option"
                  >
                    <div className="option-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0-10a5 5 0 0 1 5 5c0 2.14-1.276 3.984-3.12 4.84l.12 1.16h-4l.12-1.16C8.276 13.984 7 12.14 7 10a5 5 0 0 1 5-5Zm10 4h-2v-2h-2v2h-2v2h2v2h2v-2h2v-2Z" />
                      </svg>
                    </div>
                    <div className="option-details">
                      <h3>Change Password</h3>
                      <p>Update your current password</p>
                    </div>
                  </button>

                  <button
                    onClick={() => this.setState({ currentSetting: "del" })}
                    className="settings-option danger"
                  >
                    <div className="option-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3Zm1 2H6v12h12V8ZM9 4v2h6V4H9Z" />
                      </svg>
                    </div>
                    <div className="option-details">
                      <h3>Delete Account</h3>
                      <p>Permanent removal of all data</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {currentSetting === "cpwd" && (
              <div className="password-form">
                <button
                  onClick={() => this.setState({ currentSetting: "main" })}
                  className="back-button"
                >
                  ← Back to Settings
                </button>

                <form onSubmit={this.changePassword}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      id="password"
                      className="modern-input"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      id="npassword"
                      className="modern-input"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button type="submit" className="submit-button">
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {currentSetting === "del" && (
              <div className="danger-zone">
                <button
                  onClick={() => this.setState({ currentSetting: "main" })}
                  className="back-button"
                >
                  ← Back to Settings
                </button>

                <div className="danger-content">
                  <div className="warning-message">
                    <h3>⚠️ This action is permanent</h3>
                  </div>

                  <button
                    onClick={this.deleteAccount}
                    className="delete-button"
                  >
                    Delete Account Permanently
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default UserSettings;
