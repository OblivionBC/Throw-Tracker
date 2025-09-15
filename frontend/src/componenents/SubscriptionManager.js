import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  StyledForm,
  StyledButton,
  FieldOutputContainer,
  FieldLabel,
  SubmitError,
  StyledInput,
  StyledSelect,
} from "../styles/design-system";
import { subscriptionsApi } from "../api";
import { useApi } from "../hooks/useApi";
import useUserStore, { useUser } from "../stores/userStore";

const SubscriptionManager = () => {
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useUser();
  const { apiCall } = useApi();

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const [plansResponse, currentResponse, historyResponse] =
        await Promise.all([
          apiCall(
            () => subscriptionsApi.getAvailablePlans(),
            "Loading subscription plans"
          ),
          apiCall(
            () => subscriptionsApi.getCurrentSubscription(user.org_rk),
            "Loading current subscription"
          ),
          apiCall(
            () => subscriptionsApi.getSubscriptionHistory(user.org_rk),
            "Loading subscription history"
          ),
        ]);

      setAvailablePlans(plansResponse);
      setCurrentSubscription(currentResponse);
      setSubscriptionHistory(historyResponse);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeSubscription = async (
    values,
    { setSubmitting, setErrors }
  ) => {
    try {
      setSubmitting(true);
      await apiCall(
        () =>
          subscriptionsApi.createSubscription({
            org_rk: user.org_rk,
            ...values,
          }),
        "Upgrading subscription"
      );

      alert("Subscription upgraded successfully!");
      loadSubscriptionData(); // Reload data
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    if (
      window.confirm(
        "Are you sure you want to cancel your subscription? This action cannot be undone."
      )
    ) {
      try {
        await apiCall(
          () => subscriptionsApi.cancelSubscription(currentSubscription.sub_rk),
          "Cancelling subscription"
        );

        alert("Subscription cancelled successfully!");
        loadSubscriptionData(); // Reload data
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const formatPrice = (price, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div>Loading subscription information...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Subscription Management</h1>

      {error && <SubmitError>{error}</SubmitError>}

      {/* Current Subscription */}
      {currentSubscription && (
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2>Current Subscription</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >
            <div>
              <strong>Plan:</strong> {currentSubscription.plan_name}
            </div>
            <div>
              <strong>Status:</strong> {currentSubscription.status}
            </div>
            <div>
              <strong>Billing Cycle:</strong>{" "}
              {currentSubscription.billing_cycle}
            </div>
            <div>
              <strong>Price:</strong>{" "}
              {formatPrice(
                currentSubscription.price_per_cycle,
                currentSubscription.currency
              )}
            </div>
            <div>
              <strong>Next Billing:</strong>{" "}
              {formatDate(currentSubscription.current_period_end)}
            </div>
            <div>
              <strong>Max Athletes:</strong>{" "}
              {currentSubscription.max_athletes || "Unlimited"}
            </div>
            <div>
              <strong>Max Coaches:</strong>{" "}
              {currentSubscription.max_coaches || "Unlimited"}
            </div>
            <div>
              <strong>Max Programs:</strong>{" "}
              {currentSubscription.max_programs || "Unlimited"}
            </div>
          </div>

          {currentSubscription.status === "active" && (
            <div style={{ marginTop: "15px" }}>
              <StyledButton
                onClick={handleCancelSubscription}
                style={{ backgroundColor: "#dc3545", color: "white" }}
              >
                Cancel Subscription
              </StyledButton>
            </div>
          )}
        </div>
      )}

      {/* Available Plans */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Available Plans</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {availablePlans.map((plan) => (
            <div
              key={plan.plan_type}
              style={{
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <h3>{plan.plan_name}</h3>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {formatPrice(plan.price_per_cycle, plan.currency)}
                <span style={{ fontSize: "14px", fontWeight: "normal" }}>
                  /{plan.billing_cycle}
                </span>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <div>Max Athletes: {plan.max_athletes || "Unlimited"}</div>
                <div>Max Coaches: {plan.max_coaches || "Unlimited"}</div>
                <div>Max Programs: {plan.max_programs || "Unlimited"}</div>
                <div>
                  Max Meets/Month: {plan.max_meets_per_month || "Unlimited"}
                </div>
                <div>Storage: {plan.storage_limit_gb}GB</div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <strong>Features:</strong>
                <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                  {Object.entries(plan.features).map(([feature, enabled]) => (
                    <li
                      key={feature}
                      style={{ color: enabled ? "green" : "gray" }}
                    >
                      {feature
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </li>
                  ))}
                </ul>
              </div>

              {currentSubscription?.plan_type !== plan.plan_type && (
                <Formik
                  initialValues={{
                    plan_type: plan.plan_type,
                    plan_name: plan.plan_name,
                    billing_cycle: plan.billing_cycle,
                    price_per_cycle: plan.price_per_cycle,
                    currency: plan.currency,
                    max_athletes: plan.max_athletes,
                    max_coaches: plan.max_coaches,
                    max_programs: plan.max_programs,
                    max_meets_per_month: plan.max_meets_per_month,
                    storage_limit_gb: plan.storage_limit_gb,
                    features: plan.features,
                  }}
                  onSubmit={handleUpgradeSubscription}
                >
                  {({ handleSubmit, isSubmitting, errors }) => (
                    <StyledForm onSubmit={handleSubmit}>
                      <StyledButton
                        type="submit"
                        disabled={isSubmitting}
                        style={{ width: "100%" }}
                      >
                        {isSubmitting ? "Upgrading..." : "Upgrade to This Plan"}
                      </StyledButton>
                      {errors.submit && (
                        <SubmitError>{errors.submit}</SubmitError>
                      )}
                    </StyledForm>
                  )}
                </Formik>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subscription History */}
      {subscriptionHistory.length > 0 && (
        <div>
          <h2>Subscription History</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Plan
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Status
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Billing Cycle
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Price
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Start Date
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    End Date
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Cancelled
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptionHistory.map((subscription) => (
                  <tr key={subscription.sub_rk}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {subscription.plan_name}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {subscription.status}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {subscription.billing_cycle}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {formatPrice(subscription.price_per_cycle)}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {formatDate(subscription.current_period_start)}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {formatDate(subscription.current_period_end)}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {subscription.cancelled_at
                        ? formatDate(subscription.cancelled_at)
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
