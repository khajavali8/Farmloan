import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
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
      .get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please log in again.");
        setLoading(false);
      });
  }, []);

  const handleVerify = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.map((user) =>
        user._id === id ? { ...user, isVerified: true } : user
      ));
      alert("User successfully verified!");
    } catch (error) {
      console.error("Error verifying user:", error);
      setError("Failed to verify user.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((user) => user._id !== id));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user.");
    }
  };

  return (
    <div className="users-container">
      <h2 className="users-heading">Manage Users</h2>

      {loading ? (
        <p className="loading-text">Loading users...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr className="table-header">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="table-row">
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className={user.isVerified ? "verified" : "not-verified"}>
                  {user.isVerified ? "Verified" : "Not Verified"}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {!user.isVerified && (
                    <button
                      onClick={() => handleVerify(user._id)}
                      className="btn verify-btn"
                    >
                      Verify
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="btn delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
