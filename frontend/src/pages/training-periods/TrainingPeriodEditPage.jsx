import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditTRPEForm from "../../components/forms/EditTRPEForm";
import PracticesTable from "../../components/tables/PracticesTable";
import ProgramContentList from "../../components/tables/ProgramContentList";
import {
  CompWrap,
  StyledButton,
} from "../../styles/design-system";
import { programsApi, programMeasurableAssignmentsApi } from "../../api";
import { trainingPeriodsApi } from "../../api";
import Logger from "../../utils/logger";
import { useAsyncData } from "../../hooks/useAsyncData";
import styled from "styled-components";

const TrainingPeriodEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [programData, setProgramData] = useState([]);

  const {
    data: trpeObj,
    loading,
    error,
    refetch,
  } = useAsyncData(
    async () => {
      if (!id) return null;
      return await trainingPeriodsApi.getById(id);
    },
    [id]
  );

  useEffect(() => {
    if (trpeObj?.trpe_rk) {
      getProgramData();
    }
  }, [trpeObj]);

  const getProgramData = async () => {
    if (!trpeObj || !trpeObj.trpe_rk) return;

    try {
      // Use optimized endpoint that returns programs with measurables in one query
      const programsResponse = await programsApi.getForTrainingPeriodWithMeasurables(
        trpeObj.trpe_rk
      );

      // Transform the response to match expected format
      const transformedData = programsResponse.map((program) => ({
        prog_rk: program.prog_rk,
        prog_nm: program.prog_nm,
        measurables: program.measurables || [], // Already included from backend
      }));

      setProgramData(transformedData);
    } catch (error) {
      Logger.error("Error fetching program data:", error);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div>Loading training period...</div>
      </PageContainer>
    );
  }

  if (error || !trpeObj) {
    return (
      <PageContainer>
        <div>Error loading training period: {error || "Training period not found"}</div>
        <StyledButton onClick={() => navigate("/training-periods")}>
          Back to Training Periods
        </StyledButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate("/training-periods")}>
          ← Back to Training Periods
        </BackButton>
        <h1>Edit Training Period</h1>
      </Header>
      <Content>
        <EditTRPEForm
          trpe={trpeObj}
          on={editing}
          goToDetails={() => setEditing(!editing)}
          refresh={() => {
            refetch();
            getProgramData();
          }}
        />
        {!editing && (
          <>
            <Section>
              <h2>Practices</h2>
              <PracticesTable trpe_rk={trpeObj.trpe_rk} bAdd={true} bDetail={true} />
            </Section>
            {programData.map((program) => (
              <Section key={program.prog_rk}>
                <h2>Program: {program.prog_nm}</h2>
                <ProgramContentList
                  data={program.measurables}
                  prog_rk={program.prog_rk}
                  refresh={getProgramData}
                  bAdd={true}
                  bEdit={true}
                  bDelete={true}
                />
              </Section>
            ))}
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

export default TrainingPeriodEditPage;

