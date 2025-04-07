import React, { useState, useEffect } from "react";
import "../../styles/admin/AdminTransactions.css";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/transactions/admin/all-transactions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-transactions-container">
      <h2 className="transactions-heading">All Transactions</h2>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && transactions.length === 0 && (
        <p className="no-data">No transactions found.</p>
      )}

      {!loading && transactions.length > 0 && (
        <table className="transactions-table">
          <thead>
            <tr className="table-header">
              <th>S.no</th>
              <th>Type</th>
              <th>Amount</th>
              <th>From</th>
              <th>To</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={txn._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                <td>{index + 1}</td>
                <td>{txn.type}</td>
                <td>{txn.amount}</td>
                <td>{txn.from ? `${txn.from.firstName} ${txn.from.lastName}` : "N/A"}</td>
                <td>{txn.to ? `${txn.to.firstName} ${txn.to.lastName}` : "N/A"}</td>
                <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTransactions;
