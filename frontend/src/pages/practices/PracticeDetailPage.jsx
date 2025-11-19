import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PracticeEditForm from "../../components/forms/PracticeEditForm";
import MeasurablesList from "../../components/tables/MeasurementList";
import "typeface-nunito";
import dayjs from "dayjs";
import {
  StyledButton,
  CompWrap,
  EditButton,
  RowContainer,
  FieldName,
} from "../../styles/design-system";
import { practicesApi } from "../../api";
import { useAsyncData } from "../../hooks/useAsyncData";
import styled from "styled-components";

const PracticeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const {
    data: practice,
    loading,
    error,
    refetch,
  } = useAsyncData(
    async () => {
      if (!id) return null;
      return await practicesApi.getById(id);
    },
    [id]
  );

  if (loading) {
    return (
      <PageContainer>
        <div>Loading practice details...</div>
      </PageContainer>
    );
  }

  if (error || !practice) {
    return (
      <PageContainer>
        <div>Error loading practice: {error || "Practice not found"}</div>
        <StyledButton onClick={() => navigate("/practices")}>
          Back to Practices
        </StyledButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate("/practices")}>← Back</BackButton>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h1>Practice Details</h1>
          <EditButton onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Edit"}
          </EditButton>
        </div>
      </Header>

      <Content>
        {editing ? (
          <PracticeEditForm
            prac={practice}
            on={true}
            goToDetails={() => setEditing(false)}
            refresh={() => {
              refetch();
              setEditing(false);
            }}
          />
        ) : (
          <>
            <RowContainer>
              <FieldName>Practice Row Key:</FieldName>
              <p>{practice.prac_rk}</p>
            </RowContainer>
            <RowContainer>
              <FieldName>Date:</FieldName>
              <p>{dayjs(practice.prac_dt).format("MMM D YYYY")}</p>
            </RowContainer>
            <RowContainer>
              <FieldName>Training Period:</FieldName>
              <p>{practice.trpe_rk}</p>
            </RowContainer>
            <MeasurablesList prac_rk={practice.prac_rk} />
            <RowContainer>
              <FieldName>Notes:</FieldName>
              <p>{practice.notes || "No notes"}</p>
            </RowContainer>
          </>
        )}
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

export default PracticeDetailPage;

