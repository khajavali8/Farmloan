import React, { useState } from "react";
import "../../styles/ReportIssue.css";
const ReportIssue = () => {
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/issues/add-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ issueTitle, issueDescription }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Issue reported successfully!");
        setIssueTitle("");
        setIssueDescription("");
      } else {
        setMessage(data.message || "Failed to report issue.");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="report-container">
      <h2>Report an Issue</h2>
      {message && <p className="report-message">{message}</p>}
      <form onSubmit={handleSubmit} className="report-form">
        <label>Issue Title:</label>
        <input
          type="text"
          value={issueTitle}
          onChange={(e) => setIssueTitle(e.target.value)}
          required
          className="report-input"
        />

        <label>Issue Description:</label>
        <textarea
          value={issueDescription}
          onChange={(e) => setIssueDescription(e.target.value)}
          required
          className="report-textarea"
        />

        <button type="submit" className="report-button">Submit</button>
      </form>
    </div>
  );
};

export default ReportIssue;
