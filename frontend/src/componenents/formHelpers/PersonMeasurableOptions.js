import React from "react";
import { Field } from "formik";
import { useEffect, useState } from "react";
import { measurablesApi } from "../../api";

const PersonMeasurableOptions = ({ state, prsn_rk, name }) => {
  const [measurables, setMeasurables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurables = async () => {
      setLoading(true);
      try {
        const response = await measurablesApi.getAllForPerson(prsn_rk);
        setMeasurables(response);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };
    fetchMeasurables();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <Field as="select" name={name} placeholder="">
      <option value="-1" label="Select option" />
      {measurables?.map(({ meas_rk, meas_id, meas_unit }) => {
        return (
          <option key={meas_rk} value={meas_rk}>
            {`${meas_id} ${meas_unit}`}
          </option>
        );
      })}
    </Field>
  );
};
export default PersonMeasurableOptions;
