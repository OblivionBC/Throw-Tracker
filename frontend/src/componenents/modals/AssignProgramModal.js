import React from "react";
import DynamicModal from "../dynamicModals/DynamicModal";
import AssignProgramToTrainingPeriodsForm from "../forms/AssignProgramToTrainingPeriods";

const AssignProgramModal = ({ open, onClose, program, refresh }) => {
  if (!open) return null;

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      Component={AssignProgramToTrainingPeriodsForm}
      props={{ program }}
    ></DynamicModal>
  );
};

export default AssignProgramModal;
