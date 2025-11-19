import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditMeasurableForm from "../../components/forms/EditMeasurableForm";
import {
  CompWrap,
  StyledButton,
} from "../../styles/design-system";
import { measurablesApi } from "../../api";
import { useAsyncData } from "../../hooks/useAsyncData";
import styled from "styled-components";

const MeasurableEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: measObj,
    loading,
    error,
  } = useAsyncData(
    async () => {
      if (!id) return null;
      return await measurablesApi.getById(id);
    },
    [id]
  );

  const handleSuccess = () => {
    navigate("/measurables");
  };

  const handleCancel = () => {
    navigate("/measurables");
  };

  if (loading) {
    return (
      <PageContainer>
        <div>Loading measurable...</div>
      </PageContainer>
    );
  }

  if (error || !measObj) {
    return (
      <PageContainer>
        <div>Error loading measurable: {error || "Measurable not found"}</div>
        <StyledButton onClick={() => navigate("/measurables")}>
          Back to Measurables
        </StyledButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate("/measurables")}>
          ← Back to Measurables
        </BackButton>
        <h1>Edit Measurable</h1>
      </Header>
      <Content>
        <EditMeasurableForm
          measObj={measObj}
          close={handleCancel}
          refresh={handleSuccess}
        />
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

export default MeasurableEditPage;

