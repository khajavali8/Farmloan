import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/AllFarms.css";

const AllFarms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredFarm, setHoveredFarm] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/users/farms", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setFarms(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching farms:", error);
        setError("Failed to fetch farms. Please log in again.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="farm-container">
      <h2 className="farm-heading">All Farms</h2>

      {loading ? (
        <p className="loading-text">Loading farms...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : farms.length === 0 ? (
        <p className="no-data-text">No farms available.</p>
      ) : (
        <div className="farm-list">
          {farms.map((farm) => (
            <div
              key={farm._id}
              className={`farm-card ${
                hoveredFarm === farm._id ? "hovered" : ""
              }`}
              onMouseEnter={() => setHoveredFarm(farm._id)}
              onMouseLeave={() => setHoveredFarm(null)}
            >
              <h3 className="farm-title">{farm.name}</h3>

              {farm.images?.length > 0 && (
                <img
                  src={`http://localhost:5000/${farm.images[0]}`}
                  alt="Farm"
                  className="farm-image"
                />
              )}

              <p><strong>📍 Location:</strong> {farm.location}</p>
              <p><strong>🌾 Type:</strong> {farm.farmType}</p>
              <p><strong>📏 Size:</strong> {farm.size} acres</p>
              <p><strong>🛠 Status:</strong> {farm.status}</p>
              <p><strong>👤 Owner:</strong> {farm.farmer?.firstName} {farm.farmer?.lastName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllFarms;
