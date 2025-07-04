import React from "react";
import { useState } from "react";
import "typeface-nunito";
import EditExerciseAssignmentForm from "../forms/EditExerciseAssignment";
import ConfirmExerciseAssignmentDelete from "./ConfirmExerciseAssignmentDelete";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  EditButton,
  RowContainer,
  FieldName,
} from "../../styles/styles";
const ExerciseAssignmentDetails = ({
  open,
  onClose,
  excrObj,
  refresh,
  bEdit,
  bDelete,
  prsn_rk,
}) => {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const Details = () => {
    return (
      <>
        <RowContainer>
          <FieldName>Excercise Name:</FieldName>
          <p>{excrObj.excr_nm}</p>
        </RowContainer>
        <RowContainer>
          <FieldName>Sets:</FieldName>
          <p>{excrObj.exas_sets}</p>
        </RowContainer>
        <RowContainer>
          <FieldName>Reps:</FieldName>
          <p>{excrObj.exas_reps}</p>
        </RowContainer>
        <RowContainer>
          <FieldName>Wegiht:</FieldName>
          <p>{excrObj.exas_weight}</p>
        </RowContainer>
        {excrObj.excr_notes && (
          <RowContainer>
            <FieldName>Excercise Notes:</FieldName>
            <p style={{ overflow: "auto" }}>{excrObj.excr_notes}</p>
          </RowContainer>
        )}
        {excrObj.exas_notes && (
          <RowContainer>
            <FieldName>Excercise Assignment Notes:</FieldName>
            <p style={{ overflow: "auto" }}>{excrObj.exas_notes}</p>
          </RowContainer>
        )}

        <RowContainer>
          <FieldName>Assigned as Measurable?:</FieldName>
          <input
            type="checkbox"
            id="measurable_checkbox"
            checked={excrObj.is_measurable === "Y"}
            disabled
          />
        </RowContainer>
      </>
    );
  };

  if (!open) return null;
  return (
    <Overlay>
      <ConfirmExerciseAssignmentDelete
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        excr={excrObj}
        refresh={() => refresh()}
        fullClose={() => onClose()}
      />
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
          {editing ? (
            <EditExerciseAssignmentForm
              excr={excrObj}
              close={() => {
                setEditing(false);
              }}
              refresh={() => refresh()}
              athlete_prsn_rk={prsn_rk}
            />
          ) : (
            <Details />
          )}
        </Content>
        {bEdit && (
          <EditButton onClick={() => setEditing(!editing)}>
            {editing ? "Details" : "Edit"}
          </EditButton>
        )}
        {bDelete && (
          <button onClick={() => setConfirmDelete(true)}>Delete</button>
        )}
      </ModalContainer>
    </Overlay>
  );
};

export default ExerciseAssignmentDetails;
