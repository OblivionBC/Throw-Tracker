import React from "react";
import styled from "styled-components";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useEffect, useState } from "react";

const PersonMeasurableOptions = ({ state }) => {
  const [measurables, setMeasurables] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMeasurables = async () => {
      setLoading(true);
      try {
        const person = 1;
        const params = new URLSearchParams({
          key: JSON.stringify(person),
        });
        const response = await fetch(
          `http://localhost:5000/api//get-all-measurablesForPrsn?${params}`
        );
        const jsonData = await response.json();
        setMeasurables(jsonData.rows);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };
    fetchMeasurables();
  }, [state]);
  if (loading) return loading;
  return (
    <Field as="select" name="color">
      {measurables?.map(({ meas_id }) => (
        <option key={meas_id} value={meas_id}>
          {meas_id}
        </option>
      ))}
    </Field>
  );
};

export default PersonMeasurableOptions;
