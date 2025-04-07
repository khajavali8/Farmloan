import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/Issues.css";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
      return;
    }

    axios
      .get("http://localhost:5000/api/issues/all-issues", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setIssues(response.data))
      .catch((error) => {
        console.error("Error fetching issues:", error);
        setError("Failed to fetch issues. Please log in again.");
      });
  }, []);

  return (
    <div className="issues-container">
      <h2 className="issues-heading">📌 Reported Issues</h2>
      {error && <p className="error-text">{error}</p>}

      {issues.length === 0 ? (
        <p className="no-issues-text">✅ No issues reported.</p>
      ) : (
        <table className="issues-table">
          <thead>
            <tr className="table-header">
              <th>Title</th>
              <th>Description</th>
              <th>Reported By</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id} className="table-row">
                <td>{issue.issueTitle}</td>
                <td>{issue.issueDescription}</td>
                <td>
                  {issue.user?.firstName} {issue.user?.lastName}
                  <br />
                  <span className="email">📧 {issue.user?.email}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Issues;
