import React from "react";
import { Field } from "formik";
import { useEffect, useState } from "react";
import { measurablesApi } from "../../api";

const PersonMeasurableOptions = ({ state, name }) => {
  const [measurables, setMeasurables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurables = async () => {
      setLoading(true);
      try {
        const response = await measurablesApi.getAllForPerson();
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
    <Field name={name}>
      {({ field }) => (
        <select {...field} placeholder="">
          <option value="-1" label="Select option" />
          {measurables?.map(({ meas_rk, meas_id, meas_unit }) => {
            return (
              <option key={meas_rk} value={meas_rk}>
                {`${meas_id} ${meas_unit}`}
              </option>
            );
          })}
        </select>
      )}
    </Field>
  );
};
export default PersonMeasurableOptions;
