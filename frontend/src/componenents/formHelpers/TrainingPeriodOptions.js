import React from "react";
import { Field, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import dayjs from "dayjs";
import { API_BASE_URL } from "../../config.js";

const TrainingPeriodOptions = ({ name }) => {
  const [trainingPeriods, setTrainingPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getUser } = useUser();
  const { setFieldValue } = useFormikContext();
  useEffect(() => {
    const fetchTrainingPeriods = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api//get-all-trainingPeriods`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prsn_rk: getUser(),
            }),
          }
        );
        const jsonData = await response.json();
        setTrainingPeriods(jsonData.rows);
        if (jsonData.rowCount > 0) {
          setFieldValue(name, jsonData.rows[0].trpe_rk);
        }
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };
    fetchTrainingPeriods();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <>
      <Field
        as="select"
        name={name}
        placeholder=""
        onChange={(event) => {
          setFieldValue(name, Number(event.target.value));
        }}
      >
        {trainingPeriods?.map(({ trpe_rk, trpe_start_dt }) => {
          return (
            <option key={trpe_rk} value={trpe_rk}>
              {`Start Date: ${dayjs(trpe_start_dt).format("MMM D YYYY")}`}
            </option>
          );
        })}
      </Field>
    </>
  );
};
export default TrainingPeriodOptions;
