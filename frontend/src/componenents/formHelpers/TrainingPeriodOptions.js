import React from "react";
import { Field, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { trainingPeriodsApi } from "../../api";
import Logger from "../../utils/logger";
import { useApi } from "../../hooks/useApi";

const TrainingPeriodOptions = ({ name }) => {
  const [trainingPeriods, setTrainingPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setFieldValue } = useFormikContext();
  const { apiCall } = useApi();
  useEffect(() => {
    const fetchTrainingPeriods = async () => {
      setLoading(true);
      try {
        const response = await apiCall(
          () => trainingPeriodsApi.getAll(),
          "Fetching training periods for options"
        );
        setTrainingPeriods(response);
        if (response.length > 0) {
          setFieldValue(name, response[0].trpe_rk);
        }
      } catch (error) {
        Logger.error(error.message);
      }
      setLoading(false);
    };
    fetchTrainingPeriods();
  }, [apiCall, setFieldValue, name]);

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
