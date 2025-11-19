import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditProgramForm from "../../components/forms/EditProgram";
import {
  StyledButton,
  CompWrap,
} from "../../styles/design-system";
import { programsApi } from "../../api";
import { useAsyncData } from "../../hooks/useAsyncData";
import styled from "styled-components";

const ProgramEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: program,
    loading,
    error,
  } = useAsyncData(
    async () => {
      if (!id) return null;
      return await programsApi.getById(id);
    },
    [id]
  );

  const handleSuccess = () => {
    navigate(`/programs/${id}`);
  };

  const handleCancel = () => {
    navigate(`/programs/${id}`);
  };

  if (loading) {
    return (
      <PageContainer>
        <div>Loading program...</div>
      </PageContainer>
    );
  }

  if (error || !program) {
    return (
      <PageContainer>
        <div>Error loading program: {error || "Program not found"}</div>
        <StyledButton onClick={() => navigate("/programs")}>
          Back to Programs
        </StyledButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(`/programs/${id}`)}>
          ← Back to Program
        </BackButton>
        <h1>Edit Program</h1>
      </Header>
      <Content>
        <EditProgramForm
          program={program}
          close={handleCancel}
          refresh={handleSuccess}
        />
      </Content>
    </PageContainer>
  );
};

const PageContainer = styled(CompWrap)`
  padding: 2rem;
  max-width: 1200px;
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

export default ProgramEditPage;

