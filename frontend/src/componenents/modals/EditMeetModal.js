import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { meetsApi } from "../../api";
import dayjs from "dayjs";
import {
  StyledButton,
  CancelButton,
  CloseButton,
} from "../../styles/design-system";

const EditMeetModal = ({ open, onClose, onSuccess, meet }) => {
  const [formData, setFormData] = useState({
    meet_nm: "",
    meet_start_dt: "",
    meet_end_dt: "",
    meet_location: "",
    meet_description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (meet && open) {
      setFormData({
        meet_nm: meet.meet_nm || "",
        meet_start_dt: meet.meet_start_dt || meet.meet_dt || "",
        meet_end_dt: meet.meet_end_dt || meet.meet_dt || "",
        meet_location: meet.meet_location || "",
        meet_description: meet.meet_description || "",
      });
    }
  }, [meet, open]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await meetsApi.update(meet.meet_rk, formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating meet:", error);
      alert("Error updating meet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      meet_nm: "",
      meet_start_dt: "",
      meet_end_dt: "",
      meet_location: "",
      meet_description: "",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Edit Meet</h2>
          <CloseButton onClick={handleClose}>Close</CloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FieldContainer>
              <FieldLabel>Meet Name *</FieldLabel>
              <input
                type="text"
                value={formData.meet_nm}
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
                value={formData.meet_start_dt}
                onChange={(e) =>
                  handleInputChange("meet_start_dt", e.target.value)
                }
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
                value={formData.meet_end_dt}
                onChange={(e) =>
                  handleInputChange("meet_end_dt", e.target.value)
                }
                min={formData.meet_start_dt}
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
                value={formData.meet_location}
                onChange={(e) =>
                  handleInputChange("meet_location", e.target.value)
                }
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
                value={formData.meet_description}
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

            <ButtonContainer>
              <CancelButton type="button" onClick={handleClose}>
                Cancel
              </CancelButton>
              <StyledButton type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Meet"}
              </StyledButton>
            </ButtonContainer>
          </form>
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

const FieldContainer = styled.div`
  margin-bottom: 15px;
`;

const FieldLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

export default EditMeetModal;
