import React from "react";
import { useNavigate } from "react-router-dom";
import AddProgramForm from "../../components/forms/AddProgram";
import {
  StyledButton,
  CompWrap,
} from "../../styles/design-system";
import styled from "styled-components";

const ProgramNewPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (program) => {
    if (program && program.prog_rk) {
      navigate(`/programs/${program.prog_rk}`);
    } else {
      navigate("/programs");
    }
  };

  const handleCancel = () => {
    navigate("/programs");
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate("/programs")}>
          ← Back to Programs
        </BackButton>
        <h1>Create New Program</h1>
      </Header>
      <Content>
        <AddProgramForm
          close={handleCancel}
          refresh={() => {}}
          onProgramCreated={handleSuccess}
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

export default ProgramNewPage;

