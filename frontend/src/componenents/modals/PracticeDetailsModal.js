import React from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import PracticeEditForm from "../forms/PracticeEditForm";
import MeasurablesList from "../tables/MeasurementList";
import dayjs from "dayjs";

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
const EditButton = styled.button``;
const CloseButton = styled.button``;
const PracticeDetailsModal = ({ open, onClose, pracObj }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const Details = () => {
    if (editing) return null;
    return (
      <>
        <p>{dayjs(pracObj.prac_dt).format("MMM D YYYY")}</p>
        <MeasurablesList prac_rk={pracObj.prac_rk} />
      </>
    );
  };

  if (!open) return null;
  return (
    <Modal>
      <Overlay>
        <ModalContainer>
          <p>HERE IS MY MODAL</p>
          <CloseButton
            onClick={() => {
              onClose();
              setEditing(false);
            }}
          >
            Close
          </CloseButton>
          <Content>
            <PracticeEditForm prac={pracObj} editing={editing} />
            <Details />
          </Content>
          <EditButton onClick={() => setEditing(!editing)}>Edit</EditButton>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

export default PracticeDetailsModal;
