import React, { useEffect } from "react";
import { useState } from "react";
import "typeface-nunito";
import ProgramMeasurableContent from "../tables/ProgramContentList";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  AddButton,
  RowDiv,
} from "../../styles/styles";
import {
  programAthleteAssignmentsApi,
  programMeasurableAssignmentsApi,
} from "../../api";
const ProgramsModal = ({ open, onClose, refresh, trpe_rk }) => {
  const [loading, setLoading] = useState(false);
  const [programData, setProgramData] = useState(new Map());
  const getProgramData = async () => {
    // Don't make API call if trpe_rk is not available
    if (!trpe_rk) {
      console.warn("ProgramsModal: trpe_rk is not available");
      return;
    }

    try {
      // Get programs assigned to this training period
      const programsResponse =
        await programAthleteAssignmentsApi.getTrainingPeriodPrograms(trpe_rk);

      let newDataMap = new Map();

      // For each program, get its measurables
      for (const program of programsResponse) {
        try {
          const measurablesResponse =
            await programMeasurableAssignmentsApi.getProgramMeasurables(
              program.prog_rk
            );

          // Transform measurable data to match expected format
          const measurableData = measurablesResponse.map((measurable) => ({
            meas_id: measurable.meas_id,
            prma_rk: measurable.prma_rk,
            meas_rk: measurable.meas_rk,
            target_reps: measurable.target_reps,
            target_sets: measurable.target_sets,
            target_weight: measurable.target_weight,
            target_val: measurable.target_val,
            target_unit: measurable.target_unit,
            notes: measurable.notes,
            is_measured: measurable.is_measured,
            meas_typ: measurable.meas_typ,
            meas_unit: measurable.meas_unit,
            prog_nm: program.prog_nm,
          }));

          newDataMap.set(program.prog_rk, measurableData);
        } catch (error) {
          console.error(
            `Error fetching measurables for program ${program.prog_rk}:`,
            error
          );
          newDataMap.set(program.prog_rk, []);
        }
      }

      setProgramData(newDataMap);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    // Only fetch data if modal is open and we have valid trpe_rk
    if (open && trpe_rk) {
      getProgramData();
    }
  }, [trpe_rk, open]);
  if (!open || loading) return null;
  return (
    <Overlay>
      <ModalContainer>
        <CloseButton
          onClick={() => {
            onClose();
          }}
        >
          Close
        </CloseButton>

        <Content>
          <RowDiv>
            <h1>Programs Assigned to Training Period {trpe_rk}</h1>
            <AddButton onClick={() => getProgramData()}>Refresh</AddButton>
          </RowDiv>
          {programData.size <= 0 ? (
            <div>No Programs</div>
          ) : (
            [...programData.entries()].map(([key, row]) => (
              <ProgramMeasurableContent
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
