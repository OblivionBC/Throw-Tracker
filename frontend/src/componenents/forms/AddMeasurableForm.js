import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import "typeface-nunito";
const addMeasurable = async (meas_id, meas_typ, meas_unit) => {
  console.log(meas_id);
  const response = await fetch(`http://localhost:5000/api//add-practice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      meas_id: meas_id,
      meas_typ: meas_typ,
      meas_unit: meas_unit,
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
    date: "",
    measurables: [],
  };
  const validationSchema = Yup.object().shape({
    meas_id: Yup.number("Must be a number").required(
      "Training Period is a required field"
    ),
    date: Yup.date().required(),
    measurables: Yup.array()
      .of(
        Yup.object().shape({
          meas_rk: Yup.number("Must be a number")
            .typeError("Must Be Number")
            .required(),
          msrm_value: Yup.number("Must be a Number")
            .typeError("Must Be Number")
            .required(),
        })
      )
      .required("Must have measurables")
      .min(1, "Minimum of 1 measurable"),
  });
  const handleSubmit = async (values, { setSubmitting }) => {
    // Handle form submission here
    //Make call on submit to update practice, and delete all measurments in for the prac, then create a new one for each in the array
    setSubmitting(true);
    try {
      const prac_rk = await addMeasurable(values.date, values.meas_id);

      alert("Practice Added Successfully");
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
                  <FieldLabel>Measurable:</FieldLabel>
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
            <ErrorMessage name="meas_id" component={SubmitError} />

            <Field name="meas_typ" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Measurable:</FieldLabel>
                  <select
                    type="text"
                    placeholder={"Type of Measurable"}
                    {...field}
                  >
                    <option value="ompetitive">Competitive</option>
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
