import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useUser } from "../contexts/UserContext";
import "typeface-nunito";
const addMeasurable = async (meas_id, meas_typ, meas_unit, prsn_rk) => {
  console.log(meas_id);
  const response = await fetch(`http://localhost:5000/api//add-measurable`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }, //meas_id, meas_typ, meas_unit, prsn_rk
    body: JSON.stringify({
      meas_id: meas_id,
      meas_typ: meas_typ,
      meas_unit: meas_unit,
      prsn_rk: prsn_rk,
    }),
  });
  console.log(response);
  const jsonData = await response.json();
  console.log(jsonData);
  if (response.ok === false) {
    console.log("ERROR HAS OCCURRED ", response.statusText);
  }
  return jsonData.rows[0].prac_rk;
};

const AddMeasurableForm = ({ close, refresh }) => {
  const [failed, setFailed] = useState(false);
  const initialValues = {
    meas_id: "",
    meas_unit: "",
    meas_typ: "",
  };
  const { getUser } = useUser();
  const validationSchema = Yup.object().shape({
    meas_id: Yup.string()
      .min(3, "Measurable Name must be at least 5 characters long")
      .required("Measurable Name is required"),
    meas_unit: Yup.string()
      .min(1, "Measurable Unit must be at least 1 characters long")
      .max(15, "Measurable Unit must be 10 characters or less")
      .required("Measurable Unit is required"),
    meas_typ: Yup.string().required("Measurable Type is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    // Handle form submission here
    //Make call on submit to update practice, and delete all measurments in for the prac, then create a new one for each in the array
    console.log(values);
    setSubmitting(true);
    try {
      const measurable = await addMeasurable(
        values.meas_id,
        values.meas_typ,
        values.meas_unit,
        getUser()
      );
      console.log(measurable);
      alert("Measurable Added Successfully");
      close();
      refresh();
      setSubmitting(false);
      return;
    } catch (error) {
      setFailed(true);
      console.error(error.message);
      return false;
    }
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
          //date, training period, wind, notes, measurables
          <StyledForm onSubmit={handleSubmit}>
            <Field name="meas_id" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Measurable Name:</FieldLabel>
                  <StyledInput
                    type="text"
                    placeholder={"Name Here"}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="meas_id" component={SubmitError} />

            <Field name="meas_unit" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Units:</FieldLabel>
                  <StyledInput
                    type="text"
                    placeholder={"m/s , ft, stones"}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="meas_unit" component={SubmitError} />

            <Field name="meas_typ" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Measurable:</FieldLabel>
                  <select
                    type="text"
                    placeholder={"Type of Measurable"}
                    {...field}
                  >
                    <option value={-1}></option>
                    <option value="Competitive">Competitive</option>
                    <option value="Specific Prepatory">
                      Specific Prepatory
                    </option>
                    <option value="Specific Developmental">
                      Specific Developmental
                    </option>
                    <option value="General">General</option>
                  </select>
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="meas_typ" component={SubmitError} />
            <StyledButton type="submit" disabled={isSubmitting}>
              Save
            </StyledButton>
            {failed ? (
              <SubmitError>
                Something went wrong, please try again later
              </SubmitError>
            ) : null}
          </StyledForm>
        )}
      </Formik>
    </>
  );
};

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const StyledButton = styled.button`
  background: linear-gradient(45deg, darkblue 30%, skyblue 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 10px;
  margin-top: 10px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;
const SubmitError = styled.div`
  font-size: 18;
  color: red;
  font-family: "Nunito", sans-serif;
`;

const FieldOutputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const FieldLabel = styled.h3`
  margin-right: 10px;
`;
export default AddMeasurableForm;
