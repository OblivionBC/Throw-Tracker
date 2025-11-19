import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "typeface-nunito";
import TrainingPeriodsTable from "../../components/tables/TrainingPeriodsTable";
import AthleteEventAssignmentsList from "../../components/tables/AthleteEventAssignmentsList";
import AssignEventToAthleteModal from "../../components/modals/AssignEventToAthleteModal";
import { personsApi } from "../../api";
import Logger from "../../utils/logger";
import {
  StyledButton,
  CompWrap,
} from "../../styles/design-system";
import { useAsyncData } from "../../hooks/useAsyncData";
import styled from "styled-components";

const AthleteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignEventOpen, setAssignEventOpen] = useState(false);
  const eventAssignmentsRef = useRef();

  const {
    data: athlete,
    loading,
    error,
    refetch: refetchAthlete,
  } = useAsyncData(
    async () => {
      if (!id) return null;
      return await personsApi.getById(id);
    },
    [id]
  );

  const handleEventAssignmentRefresh = async () => {
    // Refresh the event assignments table
    if (eventAssignmentsRef.current) {
      await eventAssignmentsRef.current.refresh();
    }
    // Refresh athlete data
    refetchAthlete();
  };

  const handleUnassignMe = async () => {
    if (
      window.confirm(
        "Are you sure you want to unassign yourself from this athlete?"
      )
    ) {
      try {
        await personsApi.unassignCoachFromAthlete(id);
        alert("Successfully unassigned from athlete");
        navigate("/athletes");
      } catch (error) {
        alert("Error unassigning from athlete: " + error.message);
      }
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div>Loading athlete details...</div>
      </PageContainer>
    );
  }

  if (error || !athlete) {
    return (
      <PageContainer>
        <div>Error loading athlete: {error || "Athlete not found"}</div>
        <StyledButton onClick={() => navigate("/athletes")}>
          Back to Athletes
        </StyledButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate("/athletes")}>← Back</BackButton>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h1>{athlete.prsn_first_nm + " " + athlete.prsn_last_nm}</h1>
          <div style={{ display: "flex", gap: "10px" }}>
            <StyledButton
              onClick={() => setAssignEventOpen(true)}
              style={{ backgroundColor: "#28a745" }}
            >
              Assign Events
            </StyledButton>
            <StyledButton
              onClick={handleUnassignMe}
              style={{ backgroundColor: "#dc3545" }}
            >
              Unassign To Me
            </StyledButton>
          </div>
        </div>
      </Header>
      <Content>
        <AthleteEventAssignmentsList
          ref={eventAssignmentsRef}
          athlete_rk={id}
          onRefresh={handleEventAssignmentRefresh}
        />
        <TrainingPeriodsTable prsn_rk={id} bPrograms={true} />
      </Content>
      <AssignEventToAthleteModal
        open={assignEventOpen}
        onClose={() => setAssignEventOpen(false)}
        onSuccess={handleEventAssignmentRefresh}
        selectedAthlete={athlete}
      />
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
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export default AthleteDetailPage;

