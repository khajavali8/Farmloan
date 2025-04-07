import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/AllLoans.css";

const AllLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/users/loans", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setLoans(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching loans:", error);
        setError("Failed to fetch loans. Please log in again.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="loan-container">
      <h2 className="loan-heading">All Loan Details</h2>

      {loading ? (
        <p className="loading-text">Loading loans...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <table className="loan-table">
          <thead>
            <tr className="header-row">
              <th>Loan ID</th>
              <th>Farmer</th>
              <th>Farm Name</th>
              <th>Amount</th>
              <th>Interest Rate</th>
              <th>Duration (Months)</th>
              <th>Status</th>
              <th>Repayment Schedule</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id} className="loan-row">
                <td>{loan._id}</td>
                <td>
                  {loan.farm?.farmer?.firstName} {loan.farm?.farmer?.lastName}
                </td>
                <td>{loan.farm?.name || "N/A"}</td>
                <td>{loan.amount.toFixed(2)}</td>
                <td>{loan.interestRate}%</td>
                <td>{loan.duration} months</td>
                <td className={`status ${loan.status.toLowerCase()}`}>
                  {loan.status}
                </td>
                <td>
                  <details>
                    <summary>View Schedule</summary>
                    <ul>
                      {loan.repaymentSchedule.map((payment, index) => (
                        <li key={index}>
                          {payment.dueDate
                            ? new Date(payment.dueDate).toLocaleDateString()
                            : "No Date"}{" "}
                          - {payment.amount.toFixed(2)} (
                          <span
                            className={`repayment-status ${payment.status}`}
                          >
                            {payment.status === "paid" ? "Paid" : "Pending"}
                          </span>
                          )
                        </li>
                      ))}
                    </ul>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllLoans;
