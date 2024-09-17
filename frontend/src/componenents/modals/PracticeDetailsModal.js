import React from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import PracticeEditForm from "../forms/PracticeEditForm";
import MeasurablesList from "../tables/MeasurementList";
import "typeface-nunito";
import dayjs from "dayjs";

const PracticeDetailsModal = ({ open, onClose, pracObj }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const Details = () => {
    if (editing) return null;
    return (
      <>
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
            <PracticeEditForm prac={pracObj} on={editing} />
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
  z-index: 1;
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
const EditButton = styled.button``;
const CloseButton = styled.button`
  margin: 10px 0 0 0;
  padding: 3px;
`;
export default PracticeDetailsModal;
