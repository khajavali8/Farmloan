import React, { useState, useEffect } from "react";
import axios from "../../services/api";
import "../../styles/farmer/MyFarms.css";

const MyFarms = () => {
  const [farms, setFarms] = useState([]);
  const [editFarm, setEditFarm] = useState(null);
  const [updatedFarm, setUpdatedFarm] = useState({
    name: "",
    location: "",
    size: "",
    farmType: "",
  });
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [loan, setLoan] = useState({
    amount: "",
    interestRate: "",
    duration: "",
  });

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in first.");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("/farms/my-farms", config);
      setFarms(response.data);
    } catch (error) {
      alert("Failed to fetch farms");
    }
  };

  const handleEdit = (farm) => {
    setEditFarm(farm);
    setUpdatedFarm({
      name: farm.name || "",
      location: farm.location || "",
      size: farm.size || "",
      farmType: farm.farmType || "",
    });
  };

  const handleChange = (e) => {
    setUpdatedFarm({ ...updatedFarm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      if (!editFarm) return;
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in first.");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      await axios.put(`/farms/${editFarm._id}`, updatedFarm, config);
      alert("Farm updated successfully!");
      setEditFarm(null);
      setUpdatedFarm({ name: "", location: "", size: "", farmType: "" });
      fetchFarms();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update farm");
    }
  };

  const handleDelete = async (farmId) => {
    if (!window.confirm("Are you sure you want to delete this farm?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in first.");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/farms/${farmId}`, config);
      alert("Farm deleted successfully!");
      fetchFarms();
    } catch {
      alert("Failed to delete farm");
    }
  };

  const handleLoanRequest = (farmId) => {
    setSelectedFarmId(farmId);
    setShowLoanModal(true);
  };

  const handleLoanChange = (e) => {
    setLoan({ ...loan, [e.target.name]: e.target.value });
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in first.");

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const loanData = { ...loan, farm: selectedFarmId };
      await axios.post("/loans/create", loanData, config);
      alert("Loan request submitted!");
      setShowLoanModal(false);
      setLoan({ amount: "", interestRate: "", duration: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to request loan");
    }
  };

  return (
    <div className="my-farms-container">
      <h2>My Farms</h2>
      {farms.length === 0 ? (
        <p>No farms found.</p>
      ) : (
        <div className="farm-card-grid">
          {farms.map((farm) => (
            <div key={farm._id} className="farm-card">
              {farm.images && farm.images.length > 0 && (
                <img
                  src={`http://localhost:5000/${farm.images[0].replace(/\\/g, "/")}`}
                  alt={farm.name}
                />
              )}
              <h3>{farm.name}</h3>
              <p><strong>Farm ID:</strong> {farm._id}</p>
              <p><strong>Location:</strong> {farm.location}</p>
              <p><strong>Size:</strong> {farm.size} acres</p>
              <p><strong>Type:</strong> {farm.farmType}</p>
              <p><strong>Status:</strong> {farm.status}</p>

              <div className="farm-card-buttons">
                <button onClick={() => handleEdit(farm)}>Edit</button>
                <button onClick={() => handleDelete(farm._id)}>Delete</button>
                <button onClick={() => handleLoanRequest(farm._id)}>Request Loan</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editFarm && (
        <div className="edit-farm-modal">
          <h2>Edit Farm</h2>
          <label>Farm Name:</label>
          <input type="text" name="name" value={updatedFarm.name} onChange={handleChange} />
          <label>Location:</label>
          <input type="text" name="location" value={updatedFarm.location} onChange={handleChange} />
          <label>Size (acres):</label>
          <input type="number" name="size" value={updatedFarm.size} onChange={handleChange} />
          <label>Farm Type:</label>
          <input type="text" name="farmType" value={updatedFarm.farmType} onChange={handleChange} />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setEditFarm(null)}>Cancel</button>
        </div>
      )}

      {showLoanModal && (
        <div className="loan-modal">
          <h2>Request Loan</h2>
          <form onSubmit={handleLoanSubmit}>
            <label>Loan Amount:</label>
            <input
              type="number"
              name="amount"
              value={loan.amount}
              onChange={handleLoanChange}
              required
            />
            <label>Interest Rate (%):</label>
            <input
              type="number"
              name="interestRate"
              value={loan.interestRate}
              onChange={handleLoanChange}
              required
            />
            <label>Duration (months):</label>
            <input
              type="number"
              name="duration"
              value={loan.duration}
              onChange={handleLoanChange}
              required
            />
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowLoanModal(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyFarms;
