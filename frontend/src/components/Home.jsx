import React from "react";

/**
 * Home page with Hero, Trending, and Footer sections.
 */
function Home() {
  return (
    <div className="w3-container" style={containerStyle}>

      {/* Hero Section */}
      <div className="w3-center" style={heroContainerStyle}>
        <div className="w3-animate-opacity">
          <h1 style={heroTitleStyle}>
            TØLD
            <span style={heroSubtitleStyle}>
              Telugu Offensive Language Detection
            </span>
          </h1>

          <div style={heroButtonsWrapperStyle}>
            <button
              className="w3-button w3-round-xlarge"
              style={heroButtonPrimaryStyle}
              onMouseOver={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseOut={e => (e.currentTarget.style.transform = "none")}
              onClick={() => (window.location = "/register")}
            >
              🚀 Join Now
            </button>

            <button
              className="w3-button w3-round-xlarge"
              style={heroButtonSecondaryStyle}
              onMouseOver={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "none";
              }}
              onClick={() => (window.location = "/login")}
            >
              🔑 Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <div className="w3-row-padding" style={trendingSectionStyle}>
        <h2 style={trendingTitleStyle}>
          <span style={trendingTextGradient}>Trending Now</span>
          <div style={trendingUnderlineStyle}></div>
        </h2>

        <div className="w3-row" style={trendingCardsWrapperStyle}>
          {[1, 2, 3].map(item => (
            <div className="w3-third" key={item} style={trendingCardColumnStyle}>
              <div
                className="w3-card w3-round-xlarge"
                style={trendingCardStyle}
                onMouseOver={e => (e.currentTarget.style.transform = "translateY(-8px)")}
                onMouseOut={e => (e.currentTarget.style.transform = "none")}
              >
                <div className="w3-padding" style={cardContentStyle}>
                  <div className="w3-row" style={cardRowStyle}>
                    <div className="w3-col" style={avatarWrapperStyle}>
                      <img
                        src={`https://i.pravatar.cc/120?img=${item * 3}`}
                        alt="avatar"
                        style={avatarStyle}
                      />
                    </div>

                    <div className="w3-rest" style={cardTextWrapperStyle}>
                      <div style={cardHeaderStyle}>
                        @User_{item}
                        <span style={cardTimestampStyle}>· {item * 2}h</span>
                      </div>

                      <p style={cardBodyStyle}>
                        {item === 1 &&
                          "Quantum Computing వల్ల డేటా హ్యాకింగ్ easy? అందుకే Cyber Security next level కి వెళ్ళాలి 💻"}
                        {item === 2 &&
                          "Full Krushiga purthiga fight pettisisi… 'Enti ee IPL fixing la undi' anna valllu asalaina cricket pandithulu!"}
                        {item === 3 &&
                          "🚨5G కూడా ఇంకా ఫుల్‌గా వచ్చేది కాదు… ఇప్పుడు 6G పై R&D మొదలు 😲 Future Speed unimaginable!"}
                      </p>

                      <div style={cardFooterStyle}>
                        <span style={cardFooterItemStyle}>
                          <i className="fa fa-heart"></i>
                          {item === 1 ? "2.1K" : item === 2 ? "3.8K" : "5.6K"}
                        </span>
                        <span style={cardFooterItemStyle}>
                          <i className="fa fa-retweet"></i>
                          {item === 1 ? "489" : item === 2 ? "1.2K" : "2.3K"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer style={footerStyle}>
        <div style={footerContentStyle}>
          <div style={footerTitleStyle}>TØLD</div>
          <div style={footerLinksStyle}>
            <a href="#" style={footerLinkStyle}>About</a>
            <a href="#" style={footerLinkStyle}>Git</a>
            <a href="#" style={footerLinkStyle}>Docx</a>
          </div>
          <div style={footerCopyrightStyle}>
            © 2025 TØLD · Telugu Offensive Language Detection · #MajorProject
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style>{globalStyles}</style>
    </div>
  );
}

export default Home;

// -------------------------
// Style Constants
// -------------------------
const containerStyle = {
  backgroundColor: "#f0f2f5",
  minHeight: "100vh",
  fontFamily: "'Inter', sans-serif"
};

const heroContainerStyle = {
  padding: "8rem 2rem 10rem",
  background: "linear-gradient(135deg, rgba(29,161,242,1) 0%, rgba(16,137,214,1) 100%)",
  color: "white",
  clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)",
  marginBottom: "-4rem"
};

const heroTitleStyle = {
  fontSize: "4.5rem",
  fontWeight: 800,
  letterSpacing: "-2px",
  marginBottom: "1.5rem",
  fontFamily: "'Poppins', sans-serif",
  background: "linear-gradient(45deg, #fff 30%, #c3e4ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))"
};

const heroSubtitleStyle = {
  fontSize: "0.35em",
  display: "block",
  fontWeight: 400,
  marginTop: "1.5rem",
  fontFamily: "'Inter', sans-serif",
  WebkitTextFillColor: "rgba(255,255,255,0.9)",
  letterSpacing: "0.5px"
};

const heroButtonsWrapperStyle = { marginTop: "3rem" };

const heroButtonPrimaryStyle = {
  padding: "16px 40px",
  margin: "0 1rem",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  fontWeight: 600,
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(8px)",
  border: "2px solid rgba(255,255,255,0.3)",
  fontSize: "1.1em"
};

const heroButtonSecondaryStyle = {
  ...heroButtonPrimaryStyle,
  background: "transparent"
};

const trendingSectionStyle = {
  padding: "6rem 2rem",
  maxWidth: "1400px",
  margin: "0 auto"
};

const trendingTitleStyle = {
  fontSize: "2.5rem",
  fontWeight: 700,
  color: "#1a1a1a",
  marginBottom: "4rem",
  textAlign: "center",
  fontFamily: "'Poppins', sans-serif",
  position: "relative",
  display: "inline-block",
  left: "50%",
  transform: "translateX(-50%)",
  padding: "0 2rem"
};

const trendingTextGradient = {
  background: "linear-gradient(120deg, #1DA1F2 0%, #0d8ddb 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};

const trendingUnderlineStyle = {
  position: "absolute",
  bottom: "-10px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "60%",
  height: "4px",
  background: "linear-gradient(90deg, transparent 0%, #1DA1F2 50%, transparent 100%)"
};

const trendingCardsWrapperStyle = {
  display: "flex",
  flexWrap: "wrap"
};

const trendingCardColumnStyle = {
  display: "flex",
  padding: "0 1rem",
  marginBottom: "2rem"
};

const trendingCardStyle = {
  width: "100%",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.3)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column"
};

const cardContentStyle = { padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" };
const cardRowStyle = { alignItems: "flex-start", flex: 1 };
const avatarWrapperStyle = { width: "60px" };
const avatarStyle = { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" };
const cardTextWrapperStyle = { paddingLeft: "1.5rem", flex: 1, display: "flex", flexDirection: "column" };
const cardHeaderStyle = { fontSize: "1.1em", fontWeight: 600, color: "#1a1a1a", display: "flex", alignItems: "center", gap: "0.5rem" };
const cardTimestampStyle = { fontSize: "0.8em", fontWeight: 400, color: "#666" };
const cardBodyStyle = { fontSize: "1em", lineHeight: 1.6, color: "#444", margin: "1rem 0", flex: 1 };
const cardFooterStyle = { display: "flex", gap: "1.5rem", color: "#666", fontSize: "0.9em" };
const cardFooterItemStyle = { display: "flex", alignItems: "center", gap: "0.5rem" };

const footerStyle = {
  background: "linear-gradient(135deg, rgba(29,161,242,1) 0%, rgba(16,137,214,1) 100%)",
  color: "white",
  padding: "4rem 2rem",
  clipPath: "polygon(0 20%, 100% 0, 100% 100%, 0 100%)",
  marginTop: "6rem"
};

const footerContentStyle = { maxWidth: "1200px", margin: "0 auto", textAlign: "center" };
const footerTitleStyle = { fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem", fontFamily: "'Poppins', sans-serif" };
const footerLinksStyle = { display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "2rem" };
const footerLinkStyle = { color: "white", textDecoration: "none" };
const footerCopyrightStyle = { fontSize: "0.9em", color: "rgba(255,255,255,0.8)" };

// Global CSS injected via style tag
const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

button {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.w3-card:hover {
  box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
`;
