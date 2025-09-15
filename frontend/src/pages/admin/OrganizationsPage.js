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

const OrganizationsPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const { apiCall } = useApi();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const response = await apiCall(
        () => adminApi.getAllOrganizations(),
        "Loading organizations"
      );
      setOrganizations(response.data || response);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (
    values,
    { setSubmitting, setErrors, resetForm }
  ) => {
    try {
      setSubmitting(true);
      await apiCall(
        () => adminApi.createOrganization(values),
        "Creating organization"
      );

      alert("Organization created successfully!");
      setShowCreateForm(false);
      resetForm();
      loadOrganizations();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateOrganization = async (
    values,
    { setSubmitting, setErrors }
  ) => {
    try {
      setSubmitting(true);
      await apiCall(
        () => adminApi.updateOrganization(editingOrg.org_rk, values),
        "Updating organization"
      );

      alert("Organization updated successfully!");
      setEditingOrg(null);
      loadOrganizations();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOrganization = async (org_rk, org_name) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${org_name}"? This action cannot be undone.`
      )
    ) {
      try {
        await apiCall(
          () => adminApi.deleteOrganization(org_rk),
          "Deleting organization"
        );

        alert("Organization deleted successfully!");
        loadOrganizations();
      } catch (error) {
        setError(error.message);
      }
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
      default:
        return "#95a5a6";
    }
  };

  if (loading) {
    return <div>Loading organizations...</div>;
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
        <h2>Organizations ({organizations.length})</h2>
        <StyledButton onClick={() => setShowCreateForm(true)}>
          ➕ Create Organization
        </StyledButton>
      </div>

      {error && <SubmitError>{error}</SubmitError>}

      {/* Create Organization Form */}
      {showCreateForm && (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Create New Organization</h3>
          <Formik
            initialValues={{
              org_name: "",
              org_type: "default",
              org_code: "",
            }}
            validationSchema={Yup.object().shape({
              org_name: Yup.string()
                .required("Organization name is required")
                .max(100, "Name must be 100 characters or less"),
              org_type: Yup.string().required("Organization type is required"),
              org_code: Yup.string().max(
                50,
                "Code must be 50 characters or less"
              ),
            })}
            onSubmit={handleCreateOrganization}
          >
            {({ handleSubmit, isSubmitting, errors }) => (
              <StyledForm onSubmit={handleSubmit}>
                <Field name="org_name">
                  {({ field }) => (
                    <FieldOutputContainer>
                      <FieldLabel>Organization Name *</FieldLabel>
                      <StyledInput
                        type="text"
                        placeholder="Enter organization name"
                        {...field}
                      />
                    </FieldOutputContainer>
                  )}
                </Field>
                <ErrorMessage name="org_name" component={SubmitError} />

                <Field name="org_type">
                  {({ field }) => (
                    <FieldOutputContainer>
                      <FieldLabel>Organization Type *</FieldLabel>
                      <select
                        {...field}
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      >
                        <option value="default">Default</option>
                        <option value="school">School</option>
                        <option value="university">University</option>
                        <option value="club">Club</option>
                        <option value="team">Team</option>
                      </select>
                    </FieldOutputContainer>
                  )}
                </Field>
                <ErrorMessage name="org_type" component={SubmitError} />

                <Field name="org_code">
                  {({ field }) => (
                    <FieldOutputContainer>
                      <FieldLabel>Organization Code</FieldLabel>
                      <StyledInput
                        type="text"
                        placeholder="Enter organization code (optional)"
                        {...field}
                      />
                    </FieldOutputContainer>
                  )}
                </Field>
                <ErrorMessage name="org_code" component={SubmitError} />

                <div
                  style={{ display: "flex", gap: "10px", marginTop: "15px" }}
                >
                  <StyledButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Organization"}
                  </StyledButton>
                  <StyledButton
                    type="button"
                    onClick={() => setShowCreateForm(false)}
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
      )}

      {/* Organizations Table */}
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
                  Subscription
                </th>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Users
                </th>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Resources
                </th>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Created
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
              {organizations.map((org) => (
                <tr key={org.org_rk} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "15px" }}>
                    <div>
                      <strong>{org.org_name}</strong>
                      {org.org_type && (
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            marginTop: "2px",
                          }}
                        >
                          Type: {org.org_type}
                        </div>
                      )}
                      {org.org_code && (
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            marginTop: "2px",
                          }}
                        >
                          Code: {org.org_code}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "15px" }}>
                    {org.plan_name ? (
                      <div>
                        <div style={{ fontWeight: "bold" }}>
                          {org.plan_name}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: getStatusColor(org.subscription_status),
                            fontWeight: "bold",
                          }}
                        >
                          {org.subscription_status?.toUpperCase()}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {formatPrice(org.price_per_cycle)}/{org.billing_cycle}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: "#95a5a6" }}>No subscription</span>
                    )}
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <div style={{ fontSize: "14px" }}>
                      <div>👥 {org.current_athletes || 0} athletes</div>
                      <div>👨‍🏫 {org.current_coaches || 0} coaches</div>
                      <div>👑 {org.current_admins || 0} admins</div>
                    </div>
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <div style={{ fontSize: "14px" }}>
                      <div>📋 {org.current_programs || 0} programs</div>
                      <div>🏆 {org.current_meets || 0} meets</div>
                    </div>
                  </td>
                  <td style={{ padding: "15px" }}>
                    {formatDate(org.created_at)}
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        justifyContent: "center",
                      }}
                    >
                      <StyledButton
                        onClick={() => setEditingOrg(org)}
                        style={{ padding: "5px 10px", fontSize: "12px" }}
                      >
                        ✏️ Edit
                      </StyledButton>
                      <StyledButton
                        onClick={() =>
                          handleDeleteOrganization(org.org_rk, org.org_name)
                        }
                        style={{
                          padding: "5px 10px",
                          fontSize: "12px",
                          backgroundColor: "#e74c3c",
                        }}
                      >
                        🗑️ Delete
                      </StyledButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Organization Modal */}
      {editingOrg && (
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
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <h3>Edit Organization: {editingOrg.org_name}</h3>
            <Formik
              initialValues={{
                org_name: editingOrg.org_name,
                org_type: editingOrg.org_type || "default",
                org_code: editingOrg.org_code || "",
              }}
              validationSchema={Yup.object().shape({
                org_name: Yup.string()
                  .required("Organization name is required")
                  .max(100, "Name must be 100 characters or less"),
                org_type: Yup.string().required(
                  "Organization type is required"
                ),
                org_code: Yup.string().max(
                  50,
                  "Code must be 50 characters or less"
                ),
              })}
              onSubmit={handleUpdateOrganization}
            >
              {({ handleSubmit, isSubmitting, errors }) => (
                <StyledForm onSubmit={handleSubmit}>
                  <Field name="org_name">
                    {({ field }) => (
                      <FieldOutputContainer>
                        <FieldLabel>Organization Name *</FieldLabel>
                        <StyledInput
                          type="text"
                          placeholder="Enter organization name"
                          {...field}
                        />
                      </FieldOutputContainer>
                    )}
                  </Field>
                  <ErrorMessage name="org_name" component={SubmitError} />

                  <Field name="org_type">
                    {({ field }) => (
                      <FieldOutputContainer>
                        <FieldLabel>Organization Type *</FieldLabel>
                        <select
                          {...field}
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                          }}
                        >
                          <option value="default">Default</option>
                          <option value="school">School</option>
                          <option value="university">University</option>
                          <option value="club">Club</option>
                          <option value="team">Team</option>
                        </select>
                      </FieldOutputContainer>
                    )}
                  </Field>
                  <ErrorMessage name="org_type" component={SubmitError} />

                  <Field name="org_code">
                    {({ field }) => (
                      <FieldOutputContainer>
                        <FieldLabel>Organization Code</FieldLabel>
                        <StyledInput
                          type="text"
                          placeholder="Enter organization code (optional)"
                          {...field}
                        />
                      </FieldOutputContainer>
                    )}
                  </Field>
                  <ErrorMessage name="org_code" component={SubmitError} />

                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "15px" }}
                  >
                    <StyledButton type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update Organization"}
                    </StyledButton>
                    <StyledButton
                      type="button"
                      onClick={() => setEditingOrg(null)}
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

export default OrganizationsPage;
