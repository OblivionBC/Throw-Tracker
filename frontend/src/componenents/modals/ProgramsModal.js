import React, { useEffect } from "react";
import { useState } from "react";
import "typeface-nunito";
import ProgramContent from "../tables/ProgramContentList";
import DynamicModal from "../dynamicModals/DynamicModal";
import AddProgramForm from "../forms/AddProgram";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  AddButton,
  RowDiv,
} from "../../styles/styles";
import { programsApi } from "../../api";
const ProgramsModal = ({ open, onClose, refresh, trpe_rk }) => {
  const [loading, setLoading] = useState(false);
  const [programData, setProgramData] = useState(new Map());
  const [addProgram, setAddProgram] = useState(false);
  const getProgramData = async () => {
    try {
      const response = await programsApi.getForTRPE(trpe_rk);

      let newDataMap = new Map();
      response.forEach((element) => {
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
              prog_nm: element.prog_nm,
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
            prog_nm: element.prog_nm,
          });
        }
      });
      setProgramData(newDataMap);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getProgramData();
  }, [trpe_rk]);
  if (!open || loading) return null;
  return (
    <Overlay>
      <DynamicModal
        open={addProgram}
        onClose={() => setAddProgram(false)}
        refresh={() => getProgramData()}
        Component={AddProgramForm}
        props={{ trpe_rk }}
      />
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
                bAdd
                bDelete
                bEdit
                refresh={() => getProgramData()}
              />
            ))
          )}
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default ProgramsModal;
