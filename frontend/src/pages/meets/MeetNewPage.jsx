import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MeetCreationWizardForm from "../../components/forms/MeetCreationWizardForm";
import { meetTemplatesApi, meetsApi } from "../../api";
import Logger from "../../utils/logger";
import {
  CompWrap,
} from "../../styles/design-system";

const MeetNewPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    step1: {
      meet_nm: "",
      meet_start_dt: "",
      meet_end_dt: "",
      meet_location: "",
      meet_description: "",
      template_rk: null,
    },
    step2: {
      events: [],
    },
    step3: {
      review: false,
    },
  });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const templatesData = await meetTemplatesApi.getForOrg();
      setTemplates(templatesData);
    } catch (error) {
      Logger.error("Error loading templates:", error);
    }
  };

  const handleStepComplete = (stepData, stepNumber) => {
    setWizardData((prev) => ({
      ...prev,
      [`step${stepNumber}`]: stepData,
    }));

    if (stepNumber < 3) {
      setCurrentStep(stepNumber + 1);
    } else {
      handleCreateMeet();
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateMeet = async () => {
    setLoading(true);
    try {
      const meetData = {
        ...wizardData.step1,
        events: wizardData.step2.events,
      };

      let meetResponse;
      if (wizardData.step1.template_rk) {
        await meetTemplatesApi.createMeetFromTemplate(meetData);
        // Template creation doesn't return meet_rk, so we'll navigate to list
        navigate("/meets-list");
      } else {
        meetResponse = await meetsApi.addMeet({
          meet_nm: meetData.meet_nm,
          meet_start_dt: meetData.meet_start_dt,
          meet_end_dt: meetData.meet_end_dt,
          meet_location: meetData.meet_location,
          meet_description: meetData.meet_description,
        });

        if (meetData.events && meetData.events.length > 0) {
          for (const event of meetData.events) {
            await meetsApi.createMeetEvent(meetResponse.meet_rk, {
              etyp_rk: event.etyp_rk,
              event_date: event.event_date,
              scheduled_time: event.scheduled_time,
              event_order: event.event_order,
              notes: event.notes || null,
            });
          }
        }

        navigate(`/meets/${meetResponse.meet_rk}`);
      }
    } catch (error) {
      Logger.error("Error creating meet:", error);
      alert("Error creating meet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate("/meets-list")}>
          ← Back to Meets
        </BackButton>
        <h1>Create New Meet</h1>
      </Header>

      <StepIndicator>
        <Step active={currentStep >= 1} completed={currentStep > 1}>
          <StepNumber completed={currentStep > 1} active={currentStep >= 1}>
            1
          </StepNumber>
          <StepLabel>Basic Information</StepLabel>
        </Step>
        <Step active={currentStep >= 2} completed={currentStep > 2}>
          <StepNumber completed={currentStep > 2} active={currentStep >= 2}>
            2
          </StepNumber>
          <StepLabel>Event Scheduling</StepLabel>
        </Step>
        <Step active={currentStep >= 3}>
          <StepNumber active={currentStep >= 3}>3</StepNumber>
          <StepLabel>Review & Create</StepLabel>
        </Step>
      </StepIndicator>

      <Content>
        <MeetCreationWizardForm
          currentStep={currentStep}
          wizardData={wizardData}
          templates={templates}
          onStepComplete={handleStepComplete}
          onStepBack={handleStepBack}
          loading={loading}
        />
      </Content>
    </PageContainer>
  );
};

const PageContainer = styled(CompWrap)`
  padding: 2rem;
  max-width: 1000px;
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

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 20px;
  opacity: ${(props) => (props.active ? 1 : 0.5)};
`;

const StepNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(props) =>
    props.completed ? "#28a745" : props.active ? "#007bff" : "#ccc"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StepLabel = styled.span`
  font-size: 12px;
  color: #666;
  text-align: center;
`;

const Content = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export default MeetNewPage;

