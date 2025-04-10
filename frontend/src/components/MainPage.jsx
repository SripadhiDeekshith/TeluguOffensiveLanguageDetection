import React from "react";
import Axios from "axios";
import TweetItem from "./TweetItem";
import AddTweet from "./AddTweet";

/**
 * MainPage displays all tweets and allows creating new ones.
 * - Fetches tweets and current user on mount.
 * - Shows "New Tweet" button to open AddTweet modal.
 * - Displays "Scroll to Top" button when scrolled down.
 */
class MainPage extends React.Component {
  state = {
    tweets: [],
    currentUser: { username: "" },
    showScrollButton: false
  };

  /**
   * Fetch tweets and user, and attach scroll listener.
   */
  componentDidMount() {
    Axios.get("/api/tweets", { withCredentials: true })
      .then(res => this.setState({ tweets: res.data.reverse() }));

    // Delay to ensure session cookie is set
    setTimeout(() => {
      Axios.get("/api/getcurrentuser", { withCredentials: true })
        .then(res => this.setState({ currentUser: res.data }));
    }, 500);

    window.addEventListener("scroll", this.handleScroll);
  }

  /**
   * Clean up scroll listener.
   */
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  /**
   * Show scroll-to-top button after scrolling down.
   */
  handleScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.setState({ showScrollButton: scrollY > 100 });
  };

  /**
   * Smoothly scroll to top of page.
   */
  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  render() {
    const { tweets, currentUser, showScrollButton } = this.state;

    return (
      <div style={styles.container}>
        <main style={styles.mainContent}>

          {/* Header with New Tweet button */}
          <div style={styles.header}>
            <button
              style={styles.newTweetButton}
              onClick={() => document.getElementById("addTweet").style.display = "block"}
            >
              + New Tweet
            </button>
          </div>

          {/* AddTweet Modal */}
          <AddTweet />

          {/* Tweets List or Empty State */}
          {tweets.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No tweets to display</p>
              <p style={styles.emptySubtext}>Start by creating your first tweet</p>
            </div>
          ) : (
            <div style={styles.tweetsContainer}>
              {tweets.map(item => (
                <TweetItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  content={item.content}
                  author={item.user.username}
                  isOwner={currentUser.username === item.user.username}
                  isOffensive={item.is_offensive}
                />
              ))}
            </div>
          )}
        </main>

        {/* Scroll to Top Button */}
        {showScrollButton && (
          <button
            style={styles.scrollToTopButton}
            onClick={this.scrollToTop}
          >
            ↑
          </button>
        )}
      </div>
    );
  }
}

export default MainPage;

// -------------------------
// Style Constants
// -------------------------
const styles = {
  container: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '2rem 0'
  },
  mainContent: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center'
  },
  newTweetButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  tweetsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 0',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    marginTop: '2rem'
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#1e293b',
    margin: 0,
    fontWeight: '500'
  },
  emptySubtext: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: '0.5rem 0 0'
  },
  scrollToTopButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.2s ease'
  }
};
