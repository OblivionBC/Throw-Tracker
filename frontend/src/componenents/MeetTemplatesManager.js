import React, { useState, useEffect } from "react";
import {
  StyledButton,
  Title,
  FieldContainer,
  FieldLabel,
  FieldOutputContainer,
  AddButton,
} from "../styles/design-system";
import { meetTemplatesApi, eventTypesApi } from "../api";
import { useApi } from "../hooks/useApi";

const MeetTemplatesManager = () => {
  const [templates, setTemplates] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const { apiCall } = useApi();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [templatesResponse, eventTypesResponse] = await Promise.all([
        apiCall(() => meetTemplatesApi.getForOrg(), "Fetching meet templates"),
        apiCall(() => eventTypesApi.getAll(), "Fetching event types"),
      ]);
      setTemplates(templatesResponse);
      setEventTypes(eventTypesResponse);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (templateData) => {
    try {
      await apiCall(
        () => meetTemplatesApi.create(templateData),
        "Creating meet template"
      );
      loadData();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating template:", error);
      alert("Failed to create template. Please try again.");
    }
  };

  const handleUpdateTemplate = async (template_rk, templateData) => {
    try {
      await apiCall(
        () => meetTemplatesApi.update(template_rk, templateData),
        "Updating meet template"
      );
      loadData();
      setEditingTemplate(null);
    } catch (error) {
      console.error("Error updating template:", error);
      alert("Failed to update template. Please try again.");
    }
  };

  const handleDeleteTemplate = async (template_rk) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await apiCall(
          () => meetTemplatesApi.delete(template_rk),
          "Deleting meet template"
        );
        loadData();
      } catch (error) {
        console.error("Error deleting template:", error);
        alert("Failed to delete template. Please try again.");
      }
    }
  };

  if (loading) {
    return <div>Loading templates...</div>;
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
        <Title>Meet Templates</Title>
        <AddButton onClick={() => setShowCreateForm(true)}>
          Create Template
        </AddButton>
      </div>

      {showCreateForm && (
        <TemplateForm
          eventTypes={eventTypes}
          onSubmit={handleCreateTemplate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {editingTemplate && (
        <TemplateForm
          eventTypes={eventTypes}
          template={editingTemplate}
          onSubmit={(data) =>
            handleUpdateTemplate(editingTemplate.template_rk, data)
          }
          onCancel={() => setEditingTemplate(null)}
        />
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {templates.map((template) => (
          <div
            key={template.template_rk}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              background: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "15px",
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 5px 0" }}>{template.template_nm}</h3>
                <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                  {template.template_description}
                </p>
              </div>
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  style={{
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                  onClick={() => setEditingTemplate(template)}
                >
                  Edit
                </button>
                <button
                  style={{
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDeleteTemplate(template.template_rk)}
                >
                  Delete
                </button>
              </div>
            </div>

            <div>
              <strong>Events ({template.events?.length || 0}):</strong>
              <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                {template.events?.map((event) => (
                  <li key={event.etyp_rk}>
                    {event.etyp_type_name}
                    {event.scheduled_time && (
                      <span style={{ color: "#666", fontSize: "12px" }}>
                        {" "}
                        - {event.scheduled_time}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ fontSize: "12px", color: "#888", marginTop: "10px" }}>
              Created by: {template.prsn_first_nm} {template.prsn_last_nm}
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && !showCreateForm && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <p>No templates created yet.</p>
          <p>Create your first template to speed up meet creation!</p>
        </div>
      )}
    </div>
  );
};

const TemplateForm = ({ eventTypes, template, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    template_nm: template?.template_nm || "",
    template_description: template?.template_description || "",
    events: template?.events || [],
  });

  const handleAddEvent = () => {
    setFormData({
      ...formData,
      events: [
        ...formData.events,
        {
          etyp_rk: "",
          event_order: formData.events.length + 1,
          scheduled_time: "",
        },
      ],
    });
  };

  const handleRemoveEvent = (index) => {
    const newEvents = formData.events.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      events: newEvents.map((event, i) => ({ ...event, event_order: i + 1 })),
    });
  };

  const handleEventChange = (index, field, value) => {
    const newEvents = [...formData.events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setFormData({ ...formData, events: newEvents });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.template_nm.trim()) {
      alert("Template name is required");
      return;
    }
    if (formData.events.length === 0) {
      alert("At least one event is required");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px",
        background: "#f8f9fa",
      }}
    >
      <h3>{template ? "Edit Template" : "Create New Template"}</h3>

      <form onSubmit={handleSubmit}>
        <FieldContainer>
          <FieldLabel>Template Name *</FieldLabel>
          <FieldOutputContainer>
            <input
              type="text"
              value={formData.template_nm}
              onChange={(e) =>
                setFormData({ ...formData, template_nm: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
              placeholder="Enter template name"
            />
          </FieldOutputContainer>
        </FieldContainer>

        <FieldContainer>
          <FieldLabel>Description</FieldLabel>
          <FieldOutputContainer>
            <textarea
              value={formData.template_description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  template_description: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                minHeight: "80px",
              }}
              placeholder="Enter template description"
            />
          </FieldOutputContainer>
        </FieldContainer>

        <FieldContainer>
          <FieldLabel>Events *</FieldLabel>
          <FieldOutputContainer>
            {formData.events.map((event, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  background: "white",
                }}
              >
                <select
                  value={event.etyp_rk}
                  onChange={(e) =>
                    handleEventChange(index, "etyp_rk", e.target.value)
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Select Event</option>
                  {eventTypes.map((eventType) => (
                    <option key={eventType.etyp_rk} value={eventType.etyp_rk}>
                      {eventType.etyp_type_name} - {eventType.event_group_name}
                    </option>
                  ))}
                </select>

                <input
                  type="time"
                  value={event.scheduled_time}
                  onChange={(e) =>
                    handleEventChange(index, "scheduled_time", e.target.value)
                  }
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                  placeholder="Time (optional)"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveEvent(index)}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <StyledButton type="button" onClick={handleAddEvent}>
              Add Event
            </StyledButton>
          </FieldOutputContainer>
        </FieldContainer>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <StyledButton type="submit">
            {template ? "Update Template" : "Create Template"}
          </StyledButton>
          <StyledButton
            type="button"
            onClick={onCancel}
            style={{ background: "#6c757d" }}
          >
            Cancel
          </StyledButton>
        </div>
      </form>
    </div>
  );
};

export default MeetTemplatesManager;
