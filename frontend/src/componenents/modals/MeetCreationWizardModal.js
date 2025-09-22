import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MeetCreationWizardForm from "../forms/MeetCreationWizardForm";
import { CloseButton } from "../../styles/design-system";
import { meetTemplatesApi, meetsApi } from "../../api";
import Logger from "../../utils/logger";

const MeetCreationWizardModal = ({ open, onClose, onSuccess }) => {
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
    if (open) {
      loadTemplates();
    }
  }, [open]);

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

      // Check if a template is selected
      if (wizardData.step1.template_rk) {
        // Use template-based creation
        await meetTemplatesApi.createMeetFromTemplate(meetData);
      } else {
        // Use regular meet creation
        const meetResponse = await meetsApi.addMeet({
          meet_nm: meetData.meet_nm,
          meet_start_dt: meetData.meet_start_dt,
          meet_end_dt: meetData.meet_end_dt,
          meet_location: meetData.meet_location,
          meet_description: meetData.meet_description,
        });

        // If there are events, create them separately
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
      }

      onSuccess();
      handleClose();
    } catch (error) {
      Logger.error("Error creating meet:", error);
      alert("Error creating meet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setWizardData({
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
    onClose();
  };

  if (!open) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Create New Meet</h2>
          <CloseButton onClick={handleClose}>Close</CloseButton>
        </ModalHeader>

        <StepIndicator>
          <Step active={currentStep >= 1} completed={currentStep > 1}>
            <StepNumber>1</StepNumber>
            <StepLabel>Basic Information</StepLabel>
          </Step>
          <Step active={currentStep >= 2} completed={currentStep > 2}>
            <StepNumber>2</StepNumber>
            <StepLabel>Event Scheduling</StepLabel>
          </Step>
          <Step active={currentStep >= 3}>
            <StepNumber>3</StepNumber>
            <StepLabel>Review & Create</StepLabel>
          </Step>
        </StepIndicator>

        <ModalBody>
          <MeetCreationWizardForm
            currentStep={currentStep}
            wizardData={wizardData}
            templates={templates}
            onStepComplete={handleStepComplete}
            onStepBack={handleStepBack}
            loading={loading}
          />
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;

  h2 {
    margin: 0;
    color: #333;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #f8f9fa;
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

const ModalBody = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

export default MeetCreationWizardModal;
