import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { meetsApi } from "../../api";
import Logger from "../../utils/logger";
import {
  StyledButton,
  CompWrap,
  CancelButton,
} from "../../styles/design-system";

const MeetEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    meet_nm: "",
    meet_start_dt: "",
    meet_end_dt: "",
    meet_location: "",
    meet_description: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadMeet = async () => {
      try {
        const meet = await meetsApi.getById(id);
        setFormData({
          meet_nm: meet.meet_nm || "",
          meet_start_dt: meet.meet_start_dt || meet.meet_dt || "",
          meet_end_dt: meet.meet_end_dt || meet.meet_dt || "",
          meet_location: meet.meet_location || "",
          meet_description: meet.meet_description || "",
        });
      } catch (error) {
        Logger.error("Error loading meet:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      loadMeet();
    }
  }, [id]);

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
      await meetsApi.update(id, formData);
      navigate(`/meets/${id}`);
    } catch (error) {
      Logger.error("Error updating meet:", error);
      alert("Error updating meet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <PageContainer>
        <div>Loading meet...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(`/meets/${id}`)}>
          ← Back to Meet
        </BackButton>
        <h1>Edit Meet</h1>
      </Header>
      <Content>
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
            <CancelButton type="button" onClick={() => navigate(`/meets/${id}`)}>
              Cancel
            </CancelButton>
            <StyledButton type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Meet"}
            </StyledButton>
          </ButtonContainer>
        </form>
      </Content>
    </PageContainer>
  );
};

const PageContainer = styled(CompWrap)`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 0;
  text-align: left;
  font-family: "Rubik", sans-serif;
  margin-bottom: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Content = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

export default MeetEditPage;

