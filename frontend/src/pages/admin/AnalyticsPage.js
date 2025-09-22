import React, { useState, useEffect } from "react";
import { StyledButton, SubmitError } from "../../styles/design-system";
import { adminApi } from "../../api";
import { useApi } from "../../hooks/useApi";

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { apiCall } = useApi();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiCall(
        () => adminApi.getSubscriptionAnalytics(),
        "Loading analytics"
      );
      setAnalytics(response.data || response);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getPlanTypeColor = (planType) => {
    switch (planType) {
      case "free":
        return "#95a5a6";
      case "basic":
        return "#3498db";
      case "premium":
        return "#9b59b6";
      case "enterprise":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#27ae60";
      case "trial":
        return "#f39c12";
      case "cancelled":
        return "#e74c3c";
      case "expired":
        return "#95a5a6";
      case "suspended":
        return "#e67e22";
      default:
        return "#95a5a6";
    }
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Analytics Dashboard</h2>
        <StyledButton onClick={loadAnalytics}>🔄 Refresh Data</StyledButton>
      </div>

      {error && <SubmitError>{error}</SubmitError>}

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Total Revenue */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "#27ae60" }}>
            💰 Total Revenue
          </h3>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>
            {formatPrice(
              analytics.planCounts.reduce(
                (sum, plan) => sum + (plan.total_revenue || 0),
                0
              )
            )}
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>
            Monthly recurring revenue
          </div>
        </div>

        {/* Total Organizations */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "#3498db" }}>
            🏢 Total Organizations
          </h3>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>
            {analytics.planCounts.reduce(
              (sum, plan) => sum + (plan.count || 0),
              0
            )}
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>
            Active subscriptions
          </div>
        </div>

        {/* Active Subscriptions */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "#9b59b6" }}>
            ✅ Active Subscriptions
          </h3>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>
            {analytics.statusCounts.find((s) => s.status === "active")?.count ||
              0}
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>
            Currently active
          </div>
        </div>

        {/* Trial Subscriptions */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "#f39c12" }}>
            🆓 Trial Subscriptions
          </h3>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>
            {analytics.statusCounts.find((s) => s.status === "trial")?.count ||
              0}
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>In trial period</div>
        </div>
      </div>

      {/* Plan Distribution */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Plan Types */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3>📊 Plan Distribution</h3>
          <div style={{ marginTop: "15px" }}>
            {analytics.planCounts.map((plan) => (
              <div
                key={plan.plan_type}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: getPlanTypeColor(plan.plan_type),
                      marginRight: "10px",
                    }}
                  ></div>
                  <span
                    style={{ textTransform: "capitalize", fontWeight: "bold" }}
                  >
                    {plan.plan_type}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "bold" }}>{plan.count}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {formatPrice(plan.total_revenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Status */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3>📈 Subscription Status</h3>
          <div style={{ marginTop: "15px" }}>
            {analytics.statusCounts.map((status) => (
              <div
                key={status.status}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: getStatusColor(status.status),
                      marginRight: "10px",
                    }}
                  ></div>
                  <span
                    style={{ textTransform: "capitalize", fontWeight: "bold" }}
                  >
                    {status.status}
                  </span>
                </div>
                <div style={{ fontWeight: "bold" }}>{status.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      {analytics.revenueTrend && analytics.revenueTrend.length > 0 && (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <h3>📈 Monthly Revenue Trend</h3>
          <div style={{ marginTop: "15px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "15px",
              }}
            >
              {analytics.revenueTrend.slice(0, 12).map((month) => (
                <div
                  key={month.month}
                  style={{
                    padding: "15px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "5px",
                    }}
                  >
                    {formatDate(month.month)}
                  </div>
                  <div style={{ fontWeight: "bold", color: "#27ae60" }}>
                    {formatPrice(month.revenue)}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {month.new_subscriptions} new
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Organization Growth */}
      {analytics.organizationGrowth &&
        analytics.organizationGrowth.length > 0 && (
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3>🏢 Organization Growth</h3>
            <div style={{ marginTop: "15px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "15px",
                }}
              >
                {analytics.organizationGrowth.slice(0, 12).map((month) => (
                  <div
                    key={month.month}
                    style={{
                      padding: "15px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "6px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "5px",
                      }}
                    >
                      {formatDate(month.month)}
                    </div>
                    <div style={{ fontWeight: "bold", color: "#3498db" }}>
                      {month.new_organizations}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      new orgs
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AnalyticsPage;
