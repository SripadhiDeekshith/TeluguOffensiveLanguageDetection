import Axios from "axios";

// Ensure cookies (session) are sent with every request
Axios.defaults.withCredentials = true;

/**
 * Attempt to log in a user.
 * @param {string} email  - User's email address.
 * @param {string} pwd    - User's password.
 * @returns {Promise<true|string|Error>} 
 *   - true on success,
 *   - error message string on invalid credentials,
 *   - or throws on network/other errors.
 */
async function login(email, pwd) {
  try {
    const { data } = await Axios.post("/api/login", { email, pwd });
    if (data.error) {
      return data.error;
    }
    // Mark session as active in localStorage
    localStorage.setItem("sessionActive", "true");
    return true;
  } catch (err) {
    // Propagate error for caller to handle
    return err;
  }
}

/**
 * Check current session validity.
 * @returns {Promise<object|false>}
 *   - User data object if logged in,
 *   - false if not authenticated or on error.
 */
async function check() {
  try {
    const res = await Axios.get("/api/getcurrentuser");
    // Session cookie is valid
    localStorage.setItem("sessionActive", "true");
    return res.data;
  } catch (err) {
    // Clear any stale session flag
    localStorage.removeItem("sessionActive");
    console.error("Not logged in:", err);
    return false;
  }
}

/**
 * Log out the current user.
 * Clears session on server and redirects to /login.
 */
function logout() {
  Axios.post("/api/logout")
    .then(() => {
      // Redirect to login page
      window.location.href = "/login";
    })
    .catch((err) => {
      console.error("Logout failed:", err);
    });
}

export { login, check, logout };
