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
} from "../../styles/design-system";
import { adminApi } from "../../api";
import { useApi } from "../../hooks/useApi";

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingSubscription, setEditingSubscription] = useState(null);
  const { apiCall } = useApi();

  useEffect(() => {
    loadSubscriptions();
  });

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await apiCall(
        () => adminApi.getAllSubscriptions(),
        "Loading subscriptions"
      );
      setSubscriptions(response.data || response);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async (
    values,
    { setSubmitting, setErrors }
  ) => {
    try {
      setSubmitting(true);
      await apiCall(
        () => adminApi.updateSubscription(editingSubscription.sub_rk, values),
        "Updating subscription"
      );

      alert("Subscription updated successfully!");
      setEditingSubscription(null);
      loadSubscriptions();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
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

  if (loading) {
    return <div>Loading subscriptions...</div>;
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
        <h2>Subscriptions ({subscriptions.length})</h2>
      </div>

      {error && <SubmitError>{error}</SubmitError>}

      {/* Subscriptions Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Organization
                </th>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Plan
                </th>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Billing
                </th>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Usage
                </th>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Period
                </th>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.sub_rk} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "15px" }}>
                    <div>
                      <strong>{sub.org_name}</strong>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        ID: {sub.org_rk}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "15px" }}>
                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: getPlanTypeColor(sub.plan_type),
                        }}
                      >
                        {sub.plan_name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {sub.plan_type?.toUpperCase()}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: getStatusColor(sub.status),
                      }}
                    >
                      {sub.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <div style={{ fontSize: "14px" }}>
                      <div>
                        {formatPrice(sub.price_per_cycle, sub.currency)}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        /{sub.billing_cycle}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <div style={{ fontSize: "12px" }}>
                      <div>
                        👥 {sub.current_athletes || 0}/{sub.max_athletes || "∞"}
                      </div>
                      <div>
                        👨‍🏫 {sub.current_coaches || 0}/{sub.max_coaches || "∞"}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "15px" }}>
                    <div style={{ fontSize: "12px" }}>
                      <div>Start: {formatDate(sub.current_period_start)}</div>
                      <div>End: {formatDate(sub.current_period_end)}</div>
                    </div>
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <StyledButton
                      onClick={() => setEditingSubscription(sub)}
                      style={{ padding: "5px 10px", fontSize: "12px" }}
                    >
                      ✏️ Edit
                    </StyledButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Subscription Modal */}
      {editingSubscription && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <h3>Edit Subscription: {editingSubscription.org_name}</h3>
            <Formik
              initialValues={{
                plan_type: editingSubscription.plan_type,
                plan_name: editingSubscription.plan_name,
                billing_cycle: editingSubscription.billing_cycle,
                price_per_cycle: editingSubscription.price_per_cycle,
                status: editingSubscription.status,
                max_athletes: editingSubscription.max_athletes,
                max_coaches: editingSubscription.max_coaches,
                max_programs: editingSubscription.max_programs,
                max_meets_per_month: editingSubscription.max_meets_per_month,
                storage_limit_gb: editingSubscription.storage_limit_gb,
              }}
              validationSchema={Yup.object().shape({
                plan_type: Yup.string().oneOf(
                  ["free", "basic", "premium", "enterprise"],
                  "Invalid plan type"
                ),
                plan_name: Yup.string()
                  .required("Plan name is required")
                  .max(100, "Plan name must be 100 characters or less"),
                billing_cycle: Yup.string().oneOf(
                  ["monthly", "yearly", "lifetime"],
                  "Invalid billing cycle"
                ),
                price_per_cycle: Yup.number().min(
                  0,
                  "Price must be 0 or greater"
                ),
                status: Yup.string().oneOf(
                  ["active", "cancelled", "expired", "trial", "suspended"],
                  "Invalid status"
                ),
                max_athletes: Yup.number().min(
                  0,
                  "Max athletes must be 0 or greater"
                ),
                max_coaches: Yup.number().min(
                  0,
                  "Max coaches must be 0 or greater"
                ),
                max_programs: Yup.number().min(
                  0,
                  "Max programs must be 0 or greater"
                ),
                max_meets_per_month: Yup.number().min(
                  0,
                  "Max meets must be 0 or greater"
                ),
                storage_limit_gb: Yup.number().min(
                  0,
                  "Storage limit must be 0 or greater"
                ),
              })}
              onSubmit={handleUpdateSubscription}
            >
              {({ handleSubmit, isSubmitting, errors }) => (
                <StyledForm onSubmit={handleSubmit}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                    }}
                  >
                    <Field name="plan_type">
                      {({ field }) => (
                        <FieldOutputContainer>
                          <FieldLabel>Plan Type</FieldLabel>
                          <StyledSelect {...field}>
                            <option value="free">Free</option>
                            <option value="basic">Basic</option>
                            <option value="premium">Premium</option>
                            <option value="enterprise">Enterprise</option>
                          </StyledSelect>
                        </FieldOutputContainer>
                      )}
                    </Field>
                    <ErrorMessage name="plan_type" component={SubmitError} />

                    <Field name="plan_name">
                      {({ field }) => (
                        <FieldOutputContainer>
                          <FieldLabel>Plan Name</FieldLabel>
                          <StyledInput
                            type="text"
                            placeholder="Enter plan name"
                            {...field}
                          />
                        </FieldOutputContainer>
                      )}
                    </Field>
                    <ErrorMessage name="plan_name" component={SubmitError} />

                    <Field name="billing_cycle">
                      {({ field }) => (
                        <FieldOutputContainer>
                          <FieldLabel>Billing Cycle</FieldLabel>
                          <StyledSelect {...field}>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="lifetime">Lifetime</option>
                          </StyledSelect>
                        </FieldOutputContainer>
                      )}
                    </Field>
                    <ErrorMessage
                      name="billing_cycle"
                      component={SubmitError}
                    />

                    <Field name="price_per_cycle">
                      {({ field }) => (
                        <FieldOutputContainer>
                          <FieldLabel>Price per Cycle</FieldLabel>
                          <StyledInput
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FieldOutputContainer>
                      )}
                    </Field>
                    <ErrorMessage
                      name="price_per_cycle"
                      component={SubmitError}
                    />

                    <Field name="status">
                      {({ field }) => (
                        <FieldOutputContainer>
                          <FieldLabel>Status</FieldLabel>
                          <StyledSelect {...field}>
                            <option value="active">Active</option>
                            <option value="trial">Trial</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="expired">Expired</option>
                            <option value="suspended">Suspended</option>
                          </StyledSelect>
                        </FieldOutputContainer>
                      )}
                    </Field>
                    <ErrorMessage name="status" component={SubmitError} />

                    <Field name="max_athletes">
                      {({ field }) => (
                        <FieldOutputContainer>
                          <FieldLabel>Max Athletes (0 = unlimited)</FieldLabel>
                          <StyledInput
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                          />
                        </FieldOutputContainer>
                      )}
                    </Field>
                    <ErrorMessage name="max_athletes" component={SubmitError} />

                    <Field name="max_coaches">
                      {({ field }) => (
                        <FieldOutputContainer>
                          <FieldLabel>Max Coaches (0 = unlimited)</FieldLabel>
                          <StyledInput
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                          />
                        </FieldOutputContainer>
                      )}
                    </Field>
                    <ErrorMessage name="max_coaches" component={SubmitError} />

                    <Field name="max_programs">
                      {({ field }) => (
                        <FieldOutputContainer>
                          <FieldLabel>Max Programs (0 = unlimited)</FieldLabel>
                          <StyledInput
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                          />
                        </FieldOutputContainer>
                      )}
                    </Field>
                    <ErrorMessage name="max_programs" component={SubmitError} />

                    <Field name="max_meets_per_month">
                      {({ field }) => (
                        <FieldOutputContainer>
                          <FieldLabel>
                            Max Meets/Month (0 = unlimited)
                          </FieldLabel>
                          <StyledInput
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                          />
                        </FieldOutputContainer>
                      )}
                    </Field>
                    <ErrorMessage
                      name="max_meets_per_month"
                      component={SubmitError}
                    />

                    <Field name="storage_limit_gb">
                      {({ field }) => (
                        <FieldOutputContainer>
                          <FieldLabel>Storage Limit (GB)</FieldLabel>
                          <StyledInput
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                          />
                        </FieldOutputContainer>
                      )}
                    </Field>
                    <ErrorMessage
                      name="storage_limit_gb"
                      component={SubmitError}
                    />
                  </div>

                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "15px" }}
                  >
                    <StyledButton type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update Subscription"}
                    </StyledButton>
                    <StyledButton
                      type="button"
                      onClick={() => setEditingSubscription(null)}
                      style={{ backgroundColor: "#95a5a6" }}
                    >
                      Cancel
                    </StyledButton>
                  </div>
                  {errors.submit && <SubmitError>{errors.submit}</SubmitError>}
                </StyledForm>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
