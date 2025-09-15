import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { meetsApi, eventTypesApi } from "../../api";
import { useApi } from "../../hooks/useApi";
import { useIsCoach } from "../../stores/userStore";
import { StyledButton, CloseButton } from "../../styles/design-system";

const AddEventToMeetModal = ({ open, onClose, onSuccess, meet }) => {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    etyp_rk: "",
    event_date: "",
    scheduled_time: "",
    event_order: "",
    notes: "",
  });
  const { apiCall } = useApi();
  const isCoach = useIsCoach();

  useEffect(() => {
    if (open) {
      loadEventTypes();
      // Set default event date to meet start date
      if (meet) {
        setFormData((prev) => ({
          ...prev,
          event_date: meet.meet_start_dt || meet.meet_dt || "",
        }));
      }
    }
  }, [open, meet]);

  const loadEventTypes = async () => {
    try {
      const types = await apiCall(
        () => eventTypesApi.getAll(),
        "Loading event types"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!meet) return;

    setLoading(true);
    try {
      await apiCall(
        () => meetsApi.createMeetEvent(meet.meet_rk, formData),
        "Adding event to meet"
      );

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error adding event to meet:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      etyp_rk: "",
      event_date: "",
      scheduled_time: "",
      event_order: "",
      notes: "",
    });
    onClose();
  };

  // Only show for coaches
  if (!isCoach) {
    return null;
  }

  if (!open) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Add Event to Meet</h2>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Event Type *</Label>
              <Select
                value={formData.etyp_rk}
                onChange={(e) => handleInputChange("etyp_rk", e.target.value)}
                required
              >
                <option value="">Select an event type</option>
                {eventTypes.map((eventType) => (
                  <option key={eventType.etyp_rk} value={eventType.etyp_rk}>
                    {eventType.etyp_type_name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Event Date *</Label>
              <Input
                type="date"
                value={formData.event_date}
                onChange={(e) =>
                  handleInputChange("event_date", e.target.value)
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Scheduled Time *</Label>
              <Input
                type="time"
                value={formData.scheduled_time}
                onChange={(e) =>
                  handleInputChange("scheduled_time", e.target.value)
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Event Order</Label>
              <Input
                type="number"
                min="1"
                value={formData.event_order}
                onChange={(e) =>
                  handleInputChange("event_order", e.target.value)
                }
                placeholder="Order in the meet (optional)"
              />
            </FormGroup>

            <FormGroup>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes (optional)"
                rows="3"
              />
            </FormGroup>

            <ButtonContainer>
              <StyledButton type="button" onClick={handleClose}>
                Cancel
              </StyledButton>
              <StyledButton
                type="submit"
                disabled={loading}
                style={{ backgroundColor: "#28a745" }}
              >
                {loading ? "Adding..." : "Add Event"}
              </StyledButton>
            </ButtonContainer>
          </Form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;

  h2 {
    margin: 0;
    color: #333;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: bold;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

export default AddEventToMeetModal;
