import React, { useState } from "react";
import Axios from "axios";

/**
 * Delete a tweet by ID and reload the page.
 * @param {number|string} tid - Tweet ID
 */
const deleteTweet = (tid) => {
  Axios.delete(`/api/deletetweet/${tid}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }).then(() => window.location.reload());
};

/**
 * TweetItem component displays a tweet with title, content, and actions.
 * Props:
 * - id: Tweet ID
 * - title: Tweet title
 * - content: HTML content of the tweet
 * - author: Username of the tweet's author
 * - isOwner: Boolean indicating if current user can delete
 * - isOffensive: Boolean indicating if content is flagged
 */
function TweetItem({ id, title, content, author, isOwner, isOffensive }) {
  const [blurred, setBlurred] = useState(isOffensive);

  /**
   * Unblur content when clicked.
   */
  const handleContentClick = () => {
    if (blurred) setBlurred(false);
  };

  return (
    <div style={styles.card}>
      {/* Header with author and delete button */}
      <div style={styles.header}>
        <div style={styles.authorContainer}>
          <span style={styles.author}>@{author}</span>
          {isOwner && (
            <button
              style={styles.deleteButton}
              onClick={() => deleteTweet(id)}
            >
              <svg style={styles.trashIcon} viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </svg>
            </button>
          )}
        </div>
        <h3 style={styles.title}>{title}</h3>
      </div>

      {/* Content area, blurred if flagged */}
      <div
        style={{
          ...styles.content,
          filter: blurred ? "blur(5px)" : "none",
          cursor: blurred ? "pointer" : "default"
        }}
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Warning for offensive content */}
      {blurred && (
        <div style={styles.warning}>
          ⚠️ This content has been flagged as offensive.
        </div>
      )}

      {/* Action buttons */}
      <div style={styles.actions}>
        <button style={styles.actionButton}>
          <svg style={styles.icon} viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55" />
          </svg>
          <span style={styles.actionText}>Like</span>
        </button>
        <button style={styles.actionButton}>
          <svg style={styles.icon} viewBox="0 0 24 24">
            <path fill="currentColor" d="M17.07,1.93L12,7L6.93,1.93L5.34,3.5L11.29,9.45L12,10.16L12.71,9.45L18.66,3.5L17.07,1.93M15.54,10.5L12,14.07L8.46,10.5L7.4,11.56L12,16.16L16.6,11.56L15.54,10.5M15.54,15.5L12,19.07L8.46,15.5L7.4,16.56L12,21.16L16.6,16.56L15.54,15.5" />
          </svg>
          <span style={styles.actionText}>Retweet</span>
        </button>
        <button style={styles.actionButton}>
          <svg style={styles.icon} viewBox="0 0 24 24">
            <path fill="currentColor" d="M10,9V5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9Z" />
          </svg>
          <span style={styles.actionText}>Reply</span>
        </button>
      </div>
    </div>
  );
}

export default TweetItem;

// -------------------------
// Style Constants
// -------------------------
const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.05)'
  },
  header: {
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f0f0f0'
  },
  authorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  author: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#3b82f6',
    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: 0,
    lineHeight: '1.4'
  },
  content: {
    fontSize: '1rem',
    color: '#4a4a4a',
    lineHeight: '1.6',
    marginBottom: '1.5rem'
  },
  warning: {
    color: '#dc2626',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#fef2f2',
    borderRadius: '4px',
    textAlign: 'center'
  },
  actions: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'none',
    border: 'none',
    color: '#6b7280',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  icon: {
    width: '1.2rem',
    height: '1.2rem'
  },
  actionText: {
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  deleteButton: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  trashIcon: {
    width: '1.2rem',
    height: '1.2rem',
    color: '#ef4444'
  }
};
