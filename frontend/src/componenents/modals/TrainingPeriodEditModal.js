import React, { useEffect } from "react";
import { useState } from "react";
import "typeface-nunito";
import dayjs from "dayjs";
import EditTRPEForm from "../forms/EditTRPEForm";
import Practices from "../tables/PracticeList";
import ProgramContent from "../tables/ProgramContentList";
import { useUser } from "../contexts/UserContext";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  EditButton,
} from "../../styles/styles";

const TrainingPeriodEditModal = ({ open, onClose, trpeObj, refresh }) => {
  const [editing, setEditing] = useState(false);
  const [programData, setProgramData] = useState([]);
  const { getUser } = useUser();
  console.log(trpeObj);
  console.log({ trpeObj });
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
            trpe_rk: trpeObj.trpe_rk,
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
      setProgramData(newDataMap);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getProgramData();
  }, [trpeObj]);
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
            <ProgramContent
              data={row}
              prog_rk={key}
              prsn_rk={getUser()}
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
