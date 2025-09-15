import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { eventTypesApi } from "../../api";
import { useApi } from "../../hooks/useApi";
import {
  StyledButton,
  FieldContainer,
  FieldLabel,
  FieldOutputContainer,
} from "../../styles/design-system";

const MeetCreationWizardForm = ({
  currentStep,
  wizardData,
  templates,
  onStepComplete,
  onStepBack,
  loading,
}) => {
  const [eventTypes, setEventTypes] = useState([]);
  const [formData, setFormData] = useState({});
  const { apiCall } = useApi();

  useEffect(() => {
    loadEventTypes();
  }, []);

  useEffect(() => {
    // Initialize form data based on current step
    if (currentStep === 1) {
      setFormData(wizardData.step1);
    } else if (currentStep === 2) {
      setFormData(wizardData.step2);
    } else if (currentStep === 3) {
      setFormData(wizardData.step3);
    }
  }, [currentStep, wizardData]);

  const loadEventTypes = async () => {
    try {
      const types = await apiCall(
        () => eventTypesApi.getAll(),
        "Loading event types for meet creation"
      );
      setEventTypes(types);
    } catch (error) {
      console.error("Error loading event types:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTemplateSelect = (template_rk) => {
    if (template_rk) {
      const selectedTemplate = templates.find(
        (t) => t.template_rk === parseInt(template_rk)
      );
      if (selectedTemplate && selectedTemplate.events) {
        setFormData((prev) => ({
          ...prev,
          template_rk: parseInt(template_rk),
          events: selectedTemplate.events.map((event) => ({
            etyp_rk: event.etyp_rk,
            event_date: wizardData.step1.meet_start_dt || "",
            scheduled_time: event.scheduled_time,
            event_order: event.event_order,
            event_name:
              eventTypes.find((et) => et.etyp_rk === event.etyp_rk)
                ?.etyp_type_name || "",
          })),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        template_rk: null,
        events: [],
      }));
    }
  };

  const handleAddEvent = () => {
    setFormData((prev) => ({
      ...prev,
      events: [
        ...prev.events,
        {
          etyp_rk: "",
          event_date: wizardData.step1.meet_start_dt || "",
          scheduled_time: "",
          event_order: prev.events.length + 1,
          event_name: "",
        },
      ],
    }));
  };

  const handleRemoveEvent = (index) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index),
    }));
  };

  const handleEventChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.map((event, i) => {
        if (i === index) {
          const updatedEvent = { ...event, [field]: value };
          if (field === "etyp_rk") {
            const eventType = eventTypes.find(
              (et) => et.etyp_rk === parseInt(value)
            );
            updatedEvent.event_name = eventType?.etyp_type_name || "";
          }
          return updatedEvent;
        }
        return event;
      }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStepComplete(formData, currentStep);
  };

  const renderStep1 = () => (
    <form onSubmit={handleSubmit}>
      <FieldContainer>
        <FieldLabel>Meet Name *</FieldLabel>
        <input
          type="text"
          value={formData.meet_nm || ""}
          onChange={(e) => handleInputChange("meet_nm", e.target.value)}
          required
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </FieldContainer>

      <FieldContainer>
        <FieldLabel>Start Date *</FieldLabel>
        <input
          type="date"
          value={formData.meet_start_dt || ""}
          onChange={(e) => handleInputChange("meet_start_dt", e.target.value)}
          required
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </FieldContainer>

      <FieldContainer>
        <FieldLabel>End Date *</FieldLabel>
        <input
          type="date"
          value={formData.meet_end_dt || ""}
          onChange={(e) => handleInputChange("meet_end_dt", e.target.value)}
          min={formData.meet_start_dt || ""}
          required
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </FieldContainer>

      <FieldContainer>
        <FieldLabel>Location *</FieldLabel>
        <input
          type="text"
          value={formData.meet_location || ""}
          onChange={(e) => handleInputChange("meet_location", e.target.value)}
          required
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </FieldContainer>

      <FieldContainer>
        <FieldLabel>Description</FieldLabel>
        <textarea
          value={formData.meet_description || ""}
          onChange={(e) =>
            handleInputChange("meet_description", e.target.value)
          }
          rows="3"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </FieldContainer>

      <FieldContainer>
        <FieldLabel>Use Template (Optional)</FieldLabel>
        <select
          value={formData.template_rk || ""}
          onChange={(e) => handleTemplateSelect(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          <option value="">Select a template...</option>
          {templates.map((template) => (
            <option key={template.template_rk} value={template.template_rk}>
              {template.template_nm}
            </option>
          ))}
        </select>
      </FieldContainer>

      <ButtonContainer>
        <StyledButton type="submit" disabled={loading}>
          {loading ? "Loading..." : "Next"}
        </StyledButton>
      </ButtonContainer>
    </form>
  );

  const renderStep2 = () => (
    <div>
      <FieldContainer>
        <FieldLabel>Event Schedule</FieldLabel>
        <div style={{ marginBottom: "10px" }}>
          <StyledButton
            type="button"
            onClick={handleAddEvent}
            style={{ backgroundColor: "#28a745" }}
          >
            Add Event
          </StyledButton>
        </div>

        {formData.events && formData.events.length > 0 ? (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {formData.events.map((event, index) => (
              <EventCard key={index}>
                <EventHeader>
                  <span>Event {index + 1}</span>
                  <RemoveButton onClick={() => handleRemoveEvent(index)}>
                    Remove
                  </RemoveButton>
                </EventHeader>

                <EventGrid>
                  <div>
                    <label>Event Type *</label>
                    <select
                      value={event.etyp_rk || ""}
                      onChange={(e) =>
                        handleEventChange(index, "etyp_rk", e.target.value)
                      }
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    >
                      <option value="">Select event type...</option>
                      {eventTypes.map((type) => (
                        <option key={type.etyp_rk} value={type.etyp_rk}>
                          {type.etyp_type_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Event Date *</label>
                    <input
                      type="date"
                      value={event.event_date || ""}
                      onChange={(e) =>
                        handleEventChange(index, "event_date", e.target.value)
                      }
                      min={wizardData.step1.meet_start_dt || ""}
                      max={wizardData.step1.meet_end_dt || ""}
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    />
                  </div>

                  <div>
                    <label>Scheduled Time *</label>
                    <input
                      type="time"
                      value={event.scheduled_time || ""}
                      onChange={(e) =>
                        handleEventChange(
                          index,
                          "scheduled_time",
                          e.target.value
                        )
                      }
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    />
                  </div>

                  <div>
                    <label>Order</label>
                    <input
                      type="number"
                      value={event.event_order || index + 1}
                      onChange={(e) =>
                        handleEventChange(
                          index,
                          "event_order",
                          parseInt(e.target.value)
                        )
                      }
                      min="1"
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                </EventGrid>
              </EventCard>
            ))}
          </div>
        ) : (
          <p style={{ color: "#666", fontStyle: "italic" }}>
            No events scheduled. Click "Add Event" to schedule events for this
            meet.
          </p>
        )}
      </FieldContainer>

      <ButtonContainer>
        <StyledButton type="button" onClick={onStepBack}>
          Back
        </StyledButton>
        <StyledButton type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : "Next"}
        </StyledButton>
      </ButtonContainer>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <FieldContainer>
        <FieldLabel>Meet Information</FieldLabel>
        <FieldOutputContainer>
          <strong>Name:</strong> {wizardData.step1.meet_nm}
          <br />
          <strong>Start Date:</strong> {wizardData.step1.meet_start_dt}
          <br />
          <strong>End Date:</strong> {wizardData.step1.meet_end_dt}
          <br />
          <strong>Location:</strong> {wizardData.step1.meet_location}
          <br />
          {wizardData.step1.meet_description && (
            <>
              <strong>Description:</strong> {wizardData.step1.meet_description}
              <br />
            </>
          )}
        </FieldOutputContainer>
      </FieldContainer>

      <FieldContainer>
        <FieldLabel>Scheduled Events</FieldLabel>
        <FieldOutputContainer>
          {wizardData.step2.events && wizardData.step2.events.length > 0 ? (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {wizardData.step2.events
                .sort((a, b) => {
                  // Sort by date first, then time, then order
                  const dateA = new Date(a.event_date);
                  const dateB = new Date(b.event_date);
                  if (dateA.getTime() !== dateB.getTime()) {
                    return dateA - dateB;
                  }
                  if (a.scheduled_time !== b.scheduled_time) {
                    return a.scheduled_time.localeCompare(b.scheduled_time);
                  }
                  return a.event_order - b.event_order;
                })
                .map((event, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "10px",
                      border: "1px solid #eee",
                      marginBottom: "5px",
                      borderRadius: "4px",
                    }}
                  >
                    <strong>{event.event_name}</strong>
                    <br />
                    Date: {event.event_date}
                    <br />
                    Time: {event.scheduled_time}
                    <br />
                    Order: {event.event_order}
                  </div>
                ))}
            </div>
          ) : (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              No events scheduled.
            </p>
          )}
        </FieldOutputContainer>
      </FieldContainer>

      <ButtonContainer>
        <StyledButton type="button" onClick={onStepBack}>
          Back
        </StyledButton>
        <StyledButton
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={{ backgroundColor: "#28a745" }}
        >
          {loading ? "Creating..." : "Create Meet"}
        </StyledButton>
      </ButtonContainer>
    </div>
  );

  return (
    <FormContainer>
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </FormContainer>
  );
};

const FormContainer = styled.div`
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
`;

const EventCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background: #f8f9fa;
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-weight: bold;
  color: #333;
`;

const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: #c82333;
  }
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }
`;

export default MeetCreationWizardForm;
