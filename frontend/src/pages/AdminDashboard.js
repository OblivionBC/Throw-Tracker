import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  StyledButton,
  SubmitError,
} from "../styles/design-system";
import { useApi } from "../hooks/useApi";
import { useUser } from "../stores/userStore";
import OrganizationsPage from "./admin/OrganizationsPage";
import SubscriptionsPage from "./admin/SubscriptionsPage";
import AnalyticsPage from "./admin/AnalyticsPage";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("organizations");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User role:", user.prsn_role);
    if (user.prsn_role?.toLowerCase() !== "admin") {
      navigate("/");
      return;
    }
    setLoading(false);
  }, [user, navigate]);

  const tabs = [
    { id: "organizations", label: "Organizations", icon: "🏢" },
    { id: "subscriptions", label: "Subscriptions", icon: "💳" },
    { id: "analytics", label: "Analytics", icon: "📊" },
  ];

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  if (user.prsn_role?.toLowerCase() !== "admin") {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Access Denied</h1>
        <p>You do not have permission to access the admin dashboard.</p>
        <StyledButton onClick={() => navigate("/")}>
          Return to Home
        </StyledButton>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: "28px" }}>🛡️ Admin Dashboard</h1>
          <p style={{ margin: "5px 0 0 0", opacity: 0.8 }}>
            Manage organizations, subscriptions, and view analytics
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #ddd",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            gap: "0",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "15px 25px",
                border: "none",
                backgroundColor:
                  activeTab === tab.id ? "#3498db" : "transparent",
                color: activeTab === tab.id ? "white" : "#333",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: activeTab === tab.id ? "bold" : "normal",
                borderBottom:
                  activeTab === tab.id
                    ? "3px solid #2980b9"
                    : "3px solid transparent",
                transition: "all 0.3s ease",
              }}
            >
              <span style={{ marginRight: "8px" }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        {error && <SubmitError>{error}</SubmitError>}

        {activeTab === "organizations" && <OrganizationsPage />}
        {activeTab === "subscriptions" && <SubscriptionsPage />}
        {activeTab === "analytics" && <AnalyticsPage />}
      </div>
    </div>
  );
};

export default AdminDashboard;
