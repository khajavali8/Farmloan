import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import "../../styles/investor/ViewFarms.css"; // ✅ Import the CSS file

const ViewFarms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredFarm, setHoveredFarm] = useState(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/farms/all-farms");
        setFarms(response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
        setError("Failed to load farm data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  const handleInvest = async (farmId, loanId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication required. Please log in.");
      return;
    }

    const amount = prompt("Enter investment amount:");
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Invalid amount entered.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/loans/${loanId}/invest`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Investment successful!");
    } catch (error) {
      console.error(error);
      alert("Failed to invest.");
    }
  };

  if (loading) return <p>Loading farms...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="view-farms-container">
      <h2 className="section-title">Available Farms for Investment</h2>
      <div className="farm-grid">
        {farms.length === 0 ? (
          <p>No farms available.</p>
        ) : (
          farms.map((farm) => (
            <div
              key={farm._id}
              className={`farm-card ${hoveredFarm === farm._id ? "hovered" : ""}`}
              onMouseEnter={() => setHoveredFarm(farm._id)}
              onMouseLeave={() => setHoveredFarm(null)}
            >
              <h3>{farm.name}</h3>
              {farm.images.length > 0 && (
                <img src={`http://localhost:5000/${farm.images[0]}`} alt="Farm" className="farm-image" />
              )}
              <p><strong>Location:</strong> {farm.location}</p>
              <p><strong>Type:</strong> {farm.farmType}</p>
              <p><strong>Size:</strong> {farm.size} acres</p>
              <p><strong>Status:</strong> {farm.status}</p>
              {farm.loan && (
                <button onClick={() => handleInvest(farm._id, farm.loan._id)} className="invest-btn">
                  Invest in Farm
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewFarms;
