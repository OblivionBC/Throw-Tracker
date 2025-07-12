import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "./DynamicModal";
import AssignProgramToTrainingPeriodsForm from "../forms/AssignProgramToTrainingPeriods";

const AssignProgramModal = ({ open, onClose, program, refresh }) => {
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h2>Assign Program: {program?.prog_nm}</h2>
        </ModalHeader>
        <ModalBody>
          <AssignProgramToTrainingPeriodsForm
            close={onClose}
            refresh={refresh}
            program={program}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AssignProgramModal;
