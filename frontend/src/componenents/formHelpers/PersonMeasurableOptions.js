import React from "react";
import { Field } from "formik";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { API_BASE_URL } from "../../config.js";

const PersonMeasurableOptions = ({ state, prsn_rk, name }) => {
  const [measurables, setMeasurables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getUser } = useUser();

  useEffect(() => {
    const fetchMeasurables = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api//get-all-measurablesForPrsn`,
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
        setMeasurables(jsonData.rows);
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
