import React, { useEffect } from "react";
import { useState } from "react";
import "typeface-nunito";
import dayjs from "dayjs";
import EditTRPEForm from "../forms/EditTRPEForm";
import Practices from "../tables/PracticeList";
import ProgramMeasurableContent from "../tables/ProgramContentList";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  EditButton,
} from "../../styles/design-system";
import { programsApi, programMeasurableAssignmentsApi } from "../../api";
import Logger from "../../utils/logger";
const TrainingPeriodEditModal = ({ open, onClose, trpeObj, refresh }) => {
  const [editing, setEditing] = useState(false);
  const [programData, setProgramData] = useState([]);

  const getProgramData = async () => {
    // Don't make API call if trpeObj or trpe_rk is not available
    if (!trpeObj || !trpeObj.trpe_rk) {
      Logger.warn(
        "TrainingPeriodEditModal: trpeObj or trpe_rk is not available"
      );
      return;
    }

    try {
      // Get programs for this training period
      const programsResponse = await programsApi.getForTrainingPeriod(
        trpeObj.trpe_rk
      );

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
          }));

          newDataMap.set(program.prog_rk, measurableData);
        } catch (error) {
          Logger.error(
            `Error fetching measurables for program ${program.prog_rk}:`,
            error
          );
          newDataMap.set(program.prog_rk, []);
        }
      }

      setProgramData(newDataMap);
    } catch (error) {
      Logger.error(error.message);
    }
  };
  useEffect(() => {
    // Only fetch data if modal is open and we have valid trpeObj
    if (open && trpeObj && trpeObj.trpe_rk) {
      getProgramData();
    }
  }, [trpeObj, open]);
  const Details = () => {
    if (editing)
      return (
        <EditTRPEForm
          trpe={trpeObj}
          close={() => onClose()}
          refresh={refresh}
        />
      );
    //Add Programs into this
    return (
      <>
        <h1>Training Period: {trpeObj.trpe_rk}</h1>
        <h1>Start Date: {dayjs(trpeObj.trpe_start_dt).format("YYYY-MM-DD")}</h1>
        <h1>End Date: {trpeObj.trpe_end_dt}</h1>
        {programData.size <= 0 ? (
          <div>No Programs</div>
        ) : (
          [...programData.entries()].map(([key, row]) => (
            <ProgramMeasurableContent
              data={row}
              prog_rk={key}
              prsn_rk={trpeObj.prsn_rk}
              bAdd={false}
              bEdit={false}
              refresh={() => getProgramData()}
              key={key}
            />
          ))
        )}
        <Practices trpe_rk={trpeObj.trpe_rk} paginationNum={4} />
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
          <Details />
        </Content>
        <EditButton onClick={() => setEditing(!editing)}>
          {editing ? "Details" : "Edit"}
        </EditButton>
      </ModalContainer>
    </Overlay>
  );
};
export default TrainingPeriodEditModal;
