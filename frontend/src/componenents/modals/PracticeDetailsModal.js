import React from "react";
import { useState } from "react";
import PracticeEditForm from "../forms/PracticeEditForm";
import MeasurablesList from "../tables/MeasurementList";
import "typeface-nunito";
import dayjs from "dayjs";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  EditButton,
  RowContainer,
  FieldName,
} from "../../styles/styles";

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
        <RowContainer>
          <FieldName>Notes:</FieldName>
          <p>{pracObj.notes}</p>
        </RowContainer>
      </>
    );
  };

  if (!open) return null;
  return (
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
  );
};

export default PracticeDetailsModal;
