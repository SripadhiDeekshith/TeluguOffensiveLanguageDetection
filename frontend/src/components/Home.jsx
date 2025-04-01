import React from "react";

function Home() {
    return (
        <div className="w3-container" style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
            {/* Hero Section */}
            <div className="w3-center" style={{ 
                padding: "6rem 2rem",
                background: "linear-gradient(135deg, #1DA1F2 0%, #0d8ddb 100%)",
                color: "white",
                borderBottomLeftRadius: "50px",
                borderBottomRightRadius: "50px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }}>
                <h1 className="w3-xxxlarge w3-animate-top" style={{ 
                    fontWeight: "bold",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                    marginBottom: "2rem",
                    fontFamily: "'Bungee', cursive",
                    background: "linear-gradient(45deg, #fff, #ff6b6b)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}>
                    TØLD
                    <span style={{ 
                        fontSize: "0.4em",
                        display: "block",
                        fontWeight: "normal",
                        marginTop: "1rem",
                        fontFamily: "'Roboto', sans-serif",
                        background: "none",
                        WebkitTextFillColor: "white",
                        textShadow: "none"
                    }}>
                        Where Truth Gets TØLD
                    </span>
                </h1>
                
                <div className="w3-margin-top">
                    <button
                        className="w3-button w3-round-xxlarge w3-white w3-text-blue w3-hover-blue w3-hover-text-white"
                        style={{
                            padding: "12px 32px",
                            margin: "0 1rem",
                            transition: "all 0.3s ease",
                            fontWeight: "bold"
                        }}
                        onClick={() => window.location = "/register"}
                    >
                        Join Now
                    </button>
                    <button
                        className="w3-button w3-round-xxlarge w3-border w3-border-white w3-hover-white w3-text-white w3-hover-text-blue"
                        style={{
                            padding: "12px 32px",
                            margin: "0 1rem",
                            transition: "all 0.3s ease",
                            fontWeight: "bold"
                        }}
                        onClick={() => window.location = "/login"}
                    >
                        Log In
                    </button>
                </div>
            </div>

            {/* Trending Tweets Section */}
            <div className="w3-row-padding w3-center" style={{ 
                padding: "4rem 2rem",
                maxWidth: "1200px",
                margin: "0 auto"
            }}>
                <h2 className="w3-xxlarge" style={{ 
                    fontWeight: "bold",
                    color: "#1DA1F2",
                    marginBottom: "3rem",
                    fontFamily: "'Bungee', cursive"
                }}>
                    What's Hot Right Now 🔥
                </h2>

                <div className="w3-third w3-margin-bottom">
                    <div className="w3-card w3-round-large w3-white w3-padding" style={{
                        minHeight: "300px",
                        transition: "transform 0.3s",
                        cursor: "pointer",
                        textAlign: "left"
                    }}>
                        <div className="w3-row">
                            <div className="w3-col" style={{width: "60px"}}>
                                <img 
                                    src="https://i.pravatar.cc/60" 
                                    className="w3-circle" 
                                    alt="avatar" 
                                />
                            </div>
                            <div className="w3-rest">
                                @Pradyuman <span className="w3-text-grey">· 2h</span>
                                <p>Just switched to TØLD and holy moly, the engagement is insane! 🚀 Finally a platform that gets tech content!</p>
                                <div className="w3-text-grey">
                                    <span className="w3-margin-right"><i className="fa fa-heart"></i> 2.1K</span>
                                    <span><i className="fa fa-retweet"></i> 489</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w3-third w3-margin-bottom">
                    <div className="w3-card w3-round-large w3-white w3-padding" style={{
                        minHeight: "300px",
                        transition: "transform 0.3s",
                        cursor: "pointer",
                        textAlign: "left"
                    }}>
                        <div className="w3-row">
                            <div className="w3-col" style={{width: "60px"}}>
                                <img 
                                    src="https://i.pravatar.cc/60?img=5" 
                                    className="w3-circle" 
                                    alt="avatar" 
                                />
                            </div>
                            <div className="w3-rest">
                                @Koushi <span className="w3-text-grey">· 4h</span>
                                <p>🔥 TØLD's new gaming community is LIT! Found my squad and we're dominating the leaderboards 🎮 #TØLDgamers</p>
                                <div className="w3-text-grey">
                                    <span className="w3-margin-right"><i className="fa fa-heart"></i> 3.8K</span>
                                    <span><i className="fa fa-retweet"></i> 1.2K</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w3-third w3-margin-bottom">
                    <div className="w3-card w3-round-large w3-white w3-padding" style={{
                        minHeight: "300px",
                        transition: "transform 0.3s",
                        cursor: "pointer",
                        textAlign: "left"
                    }}>
                        <div className="w3-row">
                            <div className="w3-col" style={{width: "60px"}}>
                                <img 
                                    src="https://i.pravatar.cc/60?img=8" 
                                    className="w3-circle" 
                                    alt="avatar" 
                                />
                            </div>
                            <div className="w3-rest">
                                @Deeks<span className="w3-text-grey">· 6h</span>
                                <p>🚨 Breaking: TØLD partners with major NFT platforms! Digital artists, this is your moment! 💎 #Web3Revolution</p>
                                <div className="w3-text-grey">
                                    <span className="w3-margin-right"><i className="fa fa-heart"></i> 5.6K</span>
                                    <span><i className="fa fa-retweet"></i> 2.3K</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w3-center w3-padding-16" style={{ 
                backgroundColor: "#1DA1F2",
                color: "white",
                marginTop: "4rem",
                fontFamily: "'Bungee', cursive"
            }}>
                <p style={{ margin: 0 }}>TØLD · Telugu Offensive Language Detection · Est. 2023</p>
                <div className="w3-margin-top">
                    <span className="w3-margin-right">#MajorProject</span>
                    <span>🔥 AIML </span>
                </div>
            </footer>

            {/* Add font styles in head */}
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Roboto:wght@400;700&display=swap');
                `}
            </style>
        </div>
    );
}

export default Home;