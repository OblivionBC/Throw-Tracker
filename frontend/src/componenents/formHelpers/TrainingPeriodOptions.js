import React from "react";
import { Field, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { trainingPeriodsApi } from "../../api";

const TrainingPeriodOptions = ({ name }) => {
  const [trainingPeriods, setTrainingPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setFieldValue } = useFormikContext();
  useEffect(() => {
    const fetchTrainingPeriods = async () => {
      setLoading(true);
      try {
        const response = await trainingPeriodsApi.getAll();
        setTrainingPeriods(response);
        if (response.length > 0) {
          setFieldValue(name, response[0].trpe_rk);
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
