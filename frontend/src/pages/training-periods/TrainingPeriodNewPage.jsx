import React from "react";
import { useNavigate } from "react-router-dom";
import AddTRPEForm from "../../components/forms/AddTRPEForm";
import {
  CompWrap,
  StyledButton,
} from "../../styles/design-system";
import styled from "styled-components";

const TrainingPeriodNewPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (trpe_rk) => {
    if (trpe_rk) {
      navigate(`/training-periods/${trpe_rk}/edit`);
    } else {
      navigate("/training-periods");
    }
  };

  const handleCancel = () => {
    navigate("/training-periods");
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate("/training-periods")}>
          ← Back to Training Periods
        </BackButton>
        <h1>Create New Training Period</h1>
      </Header>
      <Content>
        <AddTRPEForm
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

export default TrainingPeriodNewPage;

