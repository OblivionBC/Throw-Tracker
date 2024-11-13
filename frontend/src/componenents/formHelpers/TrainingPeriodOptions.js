import React from "react";
import { Field } from "formik";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import dayjs from "dayjs";

const TrainingPeriodOptions = ({ state, prsn_rk, name }) => {
  const [trainingPeriods, setTrainingPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  useEffect(() => {
    const fetchTrainingPeriods = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api//get-all-trainingPeriods`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prsn_rk: user.prsn_rk,
            }),
          }
        );
        const jsonData = await response.json();
        setTrainingPeriods(jsonData.rows);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };
    fetchTrainingPeriods();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <Field as="select" name={name} placeholder="">
      <option value="-1" label="Select option" />
      {trainingPeriods?.map(({ trpe_rk, trpe_start_dt }) => {
        return (
          <option key={trpe_rk} value={trpe_rk}>
            {`Start Date: ${dayjs(trpe_start_dt).format("MMM D YYYY")}`}
          </option>
        );
      })}
    </Field>
  );
};
export default TrainingPeriodOptions;
