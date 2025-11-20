import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  StyledButton,
  CompWrap,
  EditButton,
  DeleteButton,
} from "../../styles/design-system";
import { programsApi, programAthleteAssignmentsApi } from "../../api";
import AssignProgramToAthletesModal from "../../components/modals/AssignProgramToAthletesModal";
import Logger from "../../utils/logger";
import { useAsyncData } from "../../hooks/useAsyncData";
import styled from "styled-components";
import ProgramContentList from "../../components/tables/ProgramContentList";

const ProgramDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);

  const {
    data: programData,
    loading,
    error,
    refetch: refetchProgram,
  } = useAsyncData(
    async () => {
      if (!id) return null;
      return await programsApi.getById(id);
    },
    [id]
  );

  const program = programData?.program || programData;

  useEffect(() => {
    if (programData?.assignments) {
      setAssignments(programData.assignments);
    }
  }, [programData]);

  const handleUnassign = async (paa_rk, athleteName) => {
    if (
      !window.confirm(
        `Are you sure you want to unassign ${athleteName} from this program?`
      )
    ) {
      return;
    }

    try {
      await programAthleteAssignmentsApi.removeFromAthlete(paa_rk);
      setAssignments(assignments.filter((a) => a.paa_rk !== paa_rk));
      refetchProgram(); // This will refetch everything including assignments
    } catch (error) {
      Logger.error("Error unassigning athlete:", error);
      alert("Failed to unassign athlete. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete the program "${program?.prog_nm}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await programsApi.delete(id);
      navigate("/programs");
    } catch (error) {
      Logger.error("Error deleting program:", error);
      alert(`Error: ${error.message || "Failed to delete program."}`);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div>Loading program details...</div>
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
        <BackButton onClick={() => navigate("/programs")}>← Back</BackButton>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h1>{program.prog_nm}</h1>
          <div style={{ display: "flex", gap: "10px" }}>
            <EditButton onClick={() => navigate(`/programs/${id}/edit`)}>
              Edit
            </EditButton>
            <StyledButton
              onClick={() => setAssignOpen(true)}
              style={{ backgroundColor: "#28a745" }}
            >
              Assign to Athletes
            </StyledButton>
            <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
          </div>
        </div>
      </Header>

      <Content>
        <Section>
          <h2>Program Details</h2>
          <DetailRow>
            <Label>Program Name:</Label>
            <Value>{program.prog_nm}</Value>
          </DetailRow>
          <DetailRow>
            <Label>Exercises:</Label>
            <Value>{program.exercise_count || 0}</Value>
          </DetailRow>
          <DetailRow>
            <Label>Assigned Athletes:</Label>
            <Value>{program.athlete_count || 0}</Value>
          </DetailRow>
        </Section>

        <Section>
          <h2>Exercises</h2>
          <ProgramContentList prog_rk={id} />
        </Section>

        <Section>
          <h2>Assigned Athletes</h2>
          {assignments.length === 0 ? (
            <p>No athletes assigned to this program.</p>
          ) : (
            <AthletesList>
              {assignments.map((assignment) => (
                <AthleteItem key={assignment.paa_rk}>
                  <div>
                    {assignment.athlete_first_nm} {assignment.athlete_last_nm}
                  </div>
                  <StyledButton
                    $size="sm"
                    onClick={() =>
                      handleUnassign(
                        assignment.paa_rk,
                        `${assignment.athlete_first_nm} ${assignment.athlete_last_nm}`
                      )
                    }
                    style={{ backgroundColor: "#dc3545" }}
                  >
                    Unassign
                  </StyledButton>
                </AthleteItem>
              ))}
            </AthletesList>
          )}
        </Section>
      </Content>

      {assignOpen && (
        <AssignProgramToAthletesModal
          open={assignOpen}
          onClose={() => setAssignOpen(false)}
          program={program}
          refresh={() => {
            refetchProgram(); // This will refetch everything including assignments
          }}
        />
      )}
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

const Section = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DetailRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const Label = styled.div`
  font-weight: 600;
  min-width: 150px;
`;

const Value = styled.div``;

const AthletesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AthleteItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
`;

export default ProgramDetailPage;

