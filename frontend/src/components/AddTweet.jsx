import React from "react";
import { Editor } from "@tinymce/tinymce-react/lib/cjs/main/ts";
import Axios from "axios";
import Alert from "./Alert";

// Configure Axios to send cookies for session management
Axios.defaults.withCredentials = true;

/**
 * Component for adding a new tweet.
 * Displays a modal with a title input and rich-text editor.
 */
class AddTweet extends React.Component {
  state = {
    content: "<p>I have to edit this!</p>",
    titleErr: "",
    contentErr: "",
    formErr: ""
  };

  /**
   * Update state when editor content changes
   */
  handleEditorChange = (content) => {
    this.setState({ content });
  };

  /**
   * Validate and submit the tweet form
   */
  submitForm = (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const contentText = this.state.content.replace(/<[^>]+>/g, '').trim();

    // Reset errors
    this.setState({ titleErr: "", contentErr: "", formErr: "" });

    // Validate content
    if (!contentText) {
      this.setState({ contentErr: "Add some content before posting!" });
      return;
    }

    // Validate title
    if (!title) {
      this.setState({ titleErr: "Add a title!" });
      return;
    }

    // Submit to server
    Axios.post(
      "/api/addtweet",
      { title, content: contentText },
      { headers: { "Content-Type": "application/json" } }
    )
      .then((res) => {
        if (res.data.success) {
          window.location.reload();
        } else {
          this.setState({ formErr: res.data.error });
        }
      })
      .catch((err) => {
        const errData = err.response?.data;
        if (errData?.error) {
          this.setState({
            formErr: `🚫 Blocked: ${errData.error} (${errData.offensive_votes}/${errData.total_models} models detected issues)`
          });
        } else {
          console.error(err);
        }
      });
  };

  render() {
    const { titleErr, contentErr, formErr } = this.state;

    return (
      <div className="w3-modal w3-animate-opacity" id="addTweet">
        <div className="w3-modal-content w3-card">
          <header className="w3-container w3-blue">
            <span
              className="w3-button w3-display-topright w3-hover-none w3-hover-text-white"
              onClick={() => document.getElementById("addTweet").style.display = "none"}
            >
              X
            </span>
            <h2>Add Tweet</h2>
          </header>

          <form className="w3-container" onSubmit={this.submitForm}>
            {formErr && <Alert message={formErr} />}

            <div className="w3-section">
              <p>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  className="w3-input w3-border w3-margin-bottom"
                />
                {titleErr && <small className="w3-text-red">{titleErr}</small>}
              </p>

              <p>
                <Editor
                  apiKey=<YOUR_API_KEY>
                  initialValue={this.state.content}
                  init={{
                    height: 300,
                    menubar: false,
                    statusbar: false,
                    toolbar_mode: "sliding",
                    plugins: [
                      'advlist autolink lists link image imagetools media emoticons preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                      'undo redo | formatselect | bold italic underline strikethrough | image anchor media | ' +
                      'alignleft aligncenter alignright alignjustify | ' +
                      'outdent indent | bullist numlist | fullscreen preview | emoticons help',
                    contextmenu: "bold italic underline indent outdent help"
                  }}
                  onEditorChange={this.handleEditorChange}
                />
                {contentErr && <small className="w3-text-red">{contentErr}</small>}
              </p>

              <p>
                <button type="submit" className="w3-button w3-blue">Post</button>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddTweet;
