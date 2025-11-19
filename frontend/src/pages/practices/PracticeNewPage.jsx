import React from "react";
import { useNavigate } from "react-router-dom";
import AddPracticeForm from "../../components/forms/AddPracticeForm";
import {
  CompWrap,
  StyledButton,
} from "../../styles/design-system";
import styled from "styled-components";

const PracticeNewPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (prac_rk) => {
    if (prac_rk) {
      navigate(`/practices/${prac_rk}`);
    } else {
      navigate("/practices");
    }
  };

  const handleCancel = () => {
    navigate("/practices");
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate("/practices")}>
          ← Back to Practices
        </BackButton>
        <h1>Create New Practice</h1>
      </Header>
      <Content>
        <AddPracticeForm
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

export default PracticeNewPage;

