import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../../styles/farmer/TransactionsFarmer.css";

const TransactionDetailsFarmer = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setTransaction(data);
        } else {
          console.error("Error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id]);

  if (loading) return <h2 className="loading-text">Loading transaction details...</h2>;
  if (!transaction) return <h2 className="error-text">Transaction not found</h2>;

  return (
    <div className="transaction-details-container">
      <h2 className="transaction-details-heading">Transaction Details</h2>
      <p><strong>ID:</strong> {transaction._id}</p>
      <p><strong>Amount:</strong> {transaction.amount}</p>
      <p><strong>Type:</strong> {transaction.type}</p>
      <p><strong>Status:</strong> {transaction.status}</p>
      <p><strong>From:</strong> {transaction.from.firstName} {transaction.from.lastName} ({transaction.from.email})</p>
      <p><strong>To:</strong> {transaction.to.firstName} {transaction.to.lastName} ({transaction.to.email})</p>
      {transaction.farmId && (
        <p><strong>Farm:</strong> {transaction.farmId.name} - {transaction.farmId.location}</p>
      )}
      <Link to="/farmer/transactions" className="back-button">
        Back to Transactions
      </Link>
    </div>
  );
};

export default TransactionDetailsFarmer;
