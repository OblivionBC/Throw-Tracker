import React, { useState } from "react";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  EditButton,
  AddButton,
  RowDiv,
  Title,
  FieldOutputContainer,
  FieldLabel,
} from "../../styles/design-system";
import EditMeasurableAssignmentForm from "../forms/EditMeasurableAssignment";
import ConfirmMeasurableAssignmentDelete from "./ConfirmMeasurableAssignmentDelete";

const MeasurableAssignmentDetails = ({
  open,
  onClose,
  refresh,
  measurableObj,
  bEdit,
  bDelete,
}) => {
  const [editing, setEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (!open) return null;

  const Details = () => {
    if (editing) {
      return (
        <EditMeasurableAssignmentForm
          measurable={measurableObj}
          close={() => onClose()}
          refresh={refresh}
        />
      );
    }

    return (
      <>
        <Title>Measurable Assignment Details</Title>
        <FieldOutputContainer>
          <FieldLabel>Measurable:</FieldLabel>
          <p>{measurableObj.meas_id}</p>
        </FieldOutputContainer>
        <FieldOutputContainer>
          <FieldLabel>Type:</FieldLabel>
          <p>{measurableObj.meas_typ}</p>
        </FieldOutputContainer>
        <FieldOutputContainer>
          <FieldLabel>Sort Order:</FieldLabel>
          <p>{measurableObj.sort_order}</p>
        </FieldOutputContainer>
        <FieldOutputContainer>
          <FieldLabel>Target Value:</FieldLabel>
          <p>{measurableObj.target_val || "Not set"}</p>
        </FieldOutputContainer>
        <FieldOutputContainer>
          <FieldLabel>Target Reps:</FieldLabel>
          <p>{measurableObj.target_reps || "Not set"}</p>
        </FieldOutputContainer>
        <FieldOutputContainer>
          <FieldLabel>Target Sets:</FieldLabel>
          <p>{measurableObj.target_sets || "Not set"}</p>
        </FieldOutputContainer>
        <FieldOutputContainer>
          <FieldLabel>Target Weight:</FieldLabel>
          <p>{measurableObj.target_weight || "Not set"}</p>
        </FieldOutputContainer>
        <FieldOutputContainer>
          <FieldLabel>Unit:</FieldLabel>
          <p>
            {measurableObj.target_unit || measurableObj.meas_unit || "Not set"}
          </p>
        </FieldOutputContainer>
        <FieldOutputContainer>
          <FieldLabel>Measured:</FieldLabel>
          <p>{measurableObj.is_measured ? "Yes" : "No"}</p>
        </FieldOutputContainer>
        <FieldOutputContainer>
          <FieldLabel>Notes:</FieldLabel>
          <p>{measurableObj.notes || "No notes"}</p>
        </FieldOutputContainer>
      </>
    );
  };

  return (
    <>
      <ConfirmMeasurableAssignmentDelete
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        refresh={refresh}
        measurable={measurableObj}
      />
      <Overlay>
        <ModalContainer>
          <CloseButton
            onClick={() => {
              onClose();
              setEditing(false);
            }}
          >
            Close
          </CloseButton>
          <Content>
            <Details />
          </Content>
          <RowDiv>
            {bEdit && (
              <EditButton onClick={() => setEditing(!editing)}>
                {editing ? "Cancel" : "Edit"}
              </EditButton>
            )}
            {bDelete && (
              <AddButton onClick={() => setDeleteModalOpen(true)}>
                Delete
              </AddButton>
            )}
          </RowDiv>
        </ModalContainer>
      </Overlay>
    </>
  );
};

export default MeasurableAssignmentDetails;
