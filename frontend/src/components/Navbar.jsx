import React from "react";

/**
 * Navbar component with logo and navigation links.
 * Tracks theme (light/dark) and session state.
 */
function Navbar() {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || "light"
  );
  const [sessionActive, setSessionActive] = React.useState(
    localStorage.getItem("sessionActive") === "true"
  );

  // Apply theme class to body
  React.useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Listen for sessionActive changes in localStorage
  React.useEffect(() => {
    const handleStorageChange = () => {
      setSessionActive(localStorage.getItem("sessionActive") === "true");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Navigation items based on session
  const navItems = [
    {
      name: sessionActive ? "Settings" : "Login",
      link: sessionActive ? "/settings" : "/login"
    },
    {
      name: sessionActive ? "Logout" : "Register",
      link: sessionActive ? "/logout" : "/register"
    }
  ];

  return (
    <nav style={styles.navbar(theme)}>
      <div style={styles.navContainer}>
        {/* Logo */}
        <a href="/" style={styles.logo}>
          TØLD
        </a>

        {/* Navigation Links */}
        <div style={styles.linkWrapper}>
          {navItems.map((item, idx) => (
            <a
              key={item.name}
              href={item.link}
              style={styles.navLink(theme, idx)}
              onMouseOver={e => styles.handleHover(e, theme, idx)}
              onMouseOut={e => styles.handleOut(e)}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

      {/* Global Styles */}
      <style>{globalStyles}</style>
    </nav>
  );
}

export default Navbar;

// -------------------------
// Style Constants & Helpers
// -------------------------
const styles = {
  navbar: theme => ({
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 1000,
    background:
      theme === "dark"
        ? "rgba(0, 0, 0, 0.85)"
        : "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(12px)",
    borderBottom:
      theme === "dark"
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.1)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)"
  }),

  navContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  logo: {
    fontSize: "1.8rem",
    fontWeight: 700,
    textDecoration: "none",
    background: "linear-gradient(45deg, #1DA1F2, #0d8ddb)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },

  linkWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem"
  },

  navLink: (theme, idx) => ({
    padding: "0.8rem 1.5rem",
    borderRadius: "2rem",
    textDecoration: "none",
    fontWeight: 500,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background:
      idx === 1
        ? theme === "dark"
          ? "rgba(255, 75, 75, 0.15)"
          : "rgba(255, 75, 75, 0.1)"
        : "none",
    color:
      idx === 1
        ? "#ff4b4b"
        : theme === "dark"
        ? "#fff"
        : "#1a1a1a",
    border:
      idx === 1
        ? "1px solid rgba(255, 75, 75, 0.3)"
        : "1px solid transparent",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  }),

  handleHover: (e, theme, idx) => {
    if (idx === 1) return;
    e.currentTarget.style.background =
      theme === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.05)";
  },

  handleOut: e => {
    e.currentTarget.style.background = "none";
  }
};

// Global CSS injected via style tag
const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

body {
  margin-top: 80px;
}

body.dark {
  background: #0a0a0a;
  color: #fff;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;
