import React from "react";
import { Link } from "react-router-dom";
import Footer from "../Common/Footer";
import "../../styles/admin/AdminDashboard.css";

const AdminDashboard = () => {
  const adminItems = [
    { path: "/admin/users", title: "Manage Users", icon: "👥", description: "View and manage all users." },
    { path: "/admin/documents", title: "All Documents", icon: "📄", description: "View all user documents." },
    { path: "/admin/verify-investments", title: "Verify Investments", icon: "✅", description: "Approve pending investments." },
    { path: "/admin/loans", title: "All Loans", icon: "💳", description: "Review all loan requests." },
    { path: "/admin/farms", title: "All Farms", icon: "🌾", description: "View all registered farms." },
    { path: "/admin/transactions", title: "All Transactions", icon: "💸", description: "View all financial transactions." },
    { path: "/admin/issues", title: "Reported Issues", icon: "⚠️", description: "Monitor and resolve reported issues." },
  ];

  const adminInsights = [
    { title: "🚀 Streamlined Management", description: "Easily manage users, farms, and loans from one place." },
    { title: "🛠 Efficient Issue Handling", description: "Quickly respond to reported problems to maintain platform integrity." },
    { title: "📊 Data-Driven Decisions", description: "Access insights and reports to improve the platform." },
  ];

  return (
    <div className="admin-page-container">
      <div className="admin-banner">
        <h2>📌 Admin Control Panel</h2>
        <p>Manage users, loans, and farms efficiently from one central hub.</p>
      </div>

      <div className="admin-container">
        <h1 className="admin-header">Welcome, Admin! ⚡</h1>
        <p className="admin-subheader">Take control and manage the platform effectively.</p>

        <div className="admin-insights">
          <h3>💡 Key Insights</h3>
          <ul>
            {adminInsights.map((insight, index) => (
              <li key={index}>
                <strong>{insight.title}</strong> - {insight.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="admin-card-grid">
          {adminItems.map((item, index) => (
            <Link to={item.path} key={index} className="admin-card">
              <div className="admin-card-content">
                <span className="admin-icon">{item.icon}</span>
                <h3 className="admin-card-title">{item.title}</h3>
                <p className="admin-card-desc">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
