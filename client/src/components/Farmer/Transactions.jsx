import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/farmer/TransactionsFarmer.css";

const TransactionsFarmer = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/transactions/my-transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setTransactions(data);
        } else {
          console.error("Error fetching transactions:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <h2 className="loading-text">Loading transactions...</h2>;

  return (
    <div className="transactions-container">
      <h2 className="transactions-heading">My Transactions</h2>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
              <td>{transaction._id}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.type}</td>
              <td>
                <Link to={`/farmer/transactions/${transaction._id}`} className="view-details-button">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsFarmer;
