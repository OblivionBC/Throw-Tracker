import React from "react";
import styled from "styled-components";
import { useState } from "react";
import "typeface-nunito";
import EditExerciseAssignmentForm from "../forms/EditExerciseAssignment";
import ConfirmExerciseAssignmentDelete from "./ConfirmExerciseAssignmentDelete";

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
    console.log(excrObj);
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
    <Modal>
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
    </Modal>
  );
};

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  padding: 12px 24px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
`;
const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 1400px;
  width: 70%;
  position: fixed;
  background-color: white;
  border-radius: 15px;
  padding-bottom: 10px;
  padding-top: 10px;
`;
const Content = styled.div`
  width: 90%;
`;
const RowContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  font-family: "Nunito", sans-serif;
  margin: 0;
  padding: 0;
`;

const FieldName = styled.h3`
  margin: 0 10px 0 0;
  padding: 0;
`;
const EditButton = styled.button`
  background: linear-gradient(45deg, #808080 30%, black 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;
const CloseButton = styled.button`
  background: linear-gradient(45deg, black 30%, #808080 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;
export default ExerciseAssignmentDetails;
