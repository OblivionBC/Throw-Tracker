import React from "react";
import styled from "styled-components";
import { useState } from "react";
import PracticeEditForm from "../forms/PracticeEditForm";
import MeasurablesList from "../tables/MeasurementList";
import "typeface-nunito";
import dayjs from "dayjs";

const PracticeDetailsModal = ({ open, onClose, pracObj, refresh }) => {
  const [editing, setEditing] = useState(false);

  const Details = () => {
    if (editing) return null;
    return (
      <>
        <RowContainer>
          <FieldName>Practice Row Key:</FieldName>
          <p>{pracObj.prac_rk}</p>
        </RowContainer>
        <RowContainer>
          <FieldName>Date:</FieldName>
          <p>{dayjs(pracObj.prac_dt).format("MMM D YYYY")}</p>
        </RowContainer>
        <RowContainer>
          <FieldName>Training Period:</FieldName>
          <p>{pracObj.trpe_rk}</p>
        </RowContainer>
        <MeasurablesList prac_rk={pracObj.prac_rk} />
      </>
    );
  };

  if (!open) return null;
  return (
    <Modal>
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
            <PracticeEditForm
              prac={pracObj}
              on={editing}
              goToDetails={() => setEditing(!editing)}
              refresh={() => refresh()}
            />
            <Details />
          </Content>
          <EditButton onClick={() => setEditing(!editing)}>
            {editing ? "Details" : "Edit"}
          </EditButton>
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
  max-width: 900px;
  width: 100%;
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
export default PracticeDetailsModal;
