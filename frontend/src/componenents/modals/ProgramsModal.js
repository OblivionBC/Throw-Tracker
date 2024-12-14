import React, { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";
import "typeface-nunito";
import ProgramContent from "../tables/ProgramContentList";
import DynamicModal from "../dynamicModals/DynamicModal";
import AddProgramForm from "../forms/AddProgram";

const ProgramsModal = ({ open, onClose, refresh, prsn_rk, trpe_rk }) => {
  const [loading, setLoading] = useState(false);
  const [programData, setProgramData] = useState(new Map());
  const [addProgram, setAddProgram] = useState(false);
  const getProgramData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/get-programsAndExerciseForTRPE`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trpe_rk: trpe_rk,
          }),
        }
      );

      const jsonData = await response.json();
      console.log(jsonData);
      let newDataMap = new Map();
      jsonData.rows.forEach((element) => {
        console.log(element);
        if (!newDataMap.has(element.prog_rk)) {
          newDataMap.set(element.prog_rk, [
            {
              excr_nm: element.excr_nm,
              exas_rk: element.exas_rk,
              excr_rk: element.excr_rk,
              exas_reps: element.exas_reps,
              exas_sets: element.exas_sets,
              exas_weight: element.exas_weight,
              exas_notes: element.exas_notes,
              excr_notes: element.excr_notes,
              is_measurable: element.is_measurable,
            },
          ]);
          //There is already an array, so we just need to push to it
        } else {
          newDataMap.get(element.prog_rk).push({
            excr_nm: element.excr_nm,
            exas_rk: element.exas_rk,

            exas_reps: element.exas_reps,
            excr_rk: element.excr_rk,
            exas_sets: element.exas_sets,
            exas_weight: element.exas_weight,
            exas_notes: element.exas_notes,
            excr_notes: element.excr_notes,
            is_measurable: element.is_measurable,
          });
        }
      });
      await setProgramData(newDataMap);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getProgramData();
    console.log("REFRESHING THE PROGRAMS");
  }, [trpe_rk]);
  if (!open || loading) return null;
  return (
    <Modal>
      <DynamicModal
        open={addProgram}
        onClose={() => setAddProgram(false)}
        refresh={() => getProgramData()}
        Component={AddProgramForm}
        props={{ trpe_rk }}
      />
      <Overlay>
        <ModalContainer>
          <CloseButton
            onClick={() => {
              onClose();
            }}
          >
            Close
          </CloseButton>

          <AddButton onClick={() => setAddProgram(true)}>Add Program</AddButton>
          <Content>
            <RowDiv>
              <h1>Training Period {trpe_rk}</h1>
              <AddButton onClick={() => getProgramData()}>Refresh</AddButton>
            </RowDiv>
            {programData.size <= 0 ? (
              <div>No Programs</div>
            ) : (
              [...programData.entries()].map(([key, row]) => (
                <ProgramContent
                  data={row}
                  prog_rk={key}
                  prsn_rk={prsn_rk}
                  refresh={() => getProgramData()}
                />
              ))
            )}
          </Content>
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
const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
const AddButton = styled.button`
  background: linear-gradient(45deg, #808080 30%, white 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 10px;
  font-size: 16px;
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
export default ProgramsModal;
