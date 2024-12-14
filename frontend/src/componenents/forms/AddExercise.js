import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useUser } from "../contexts/UserContext";
import "typeface-nunito";
const addExercise = async (props) => {
  console.log("Adding");

  const response = await fetch(`http://localhost:5000/api/add-exercise`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coach_prsn_rk: props.coach_prsn_rk,
      excr_nm: props.excr_nm,
      excr_notes: props.excr_notes,
      excr_units: props.excr_units,
      excr_typ: props.excr_typ,
    }),
  });
  console.log("Past");
  const jsonData = await response.json();
  console.log(jsonData);
  if (response.ok === false) {
    console.log("ERROR HAS OCCURRED ", jsonData);

    props.setErrors(jsonData.message);
    throw new Error(jsonData.message);
  }
};

const AddExerciseForm = ({ close, refresh, prog_rk, coach_prsn_rk, props }) => {
  const initialValues = {
    excr_nm: "",
    excr_notes: "",
    excr_units: "",
    excr_typ: "Competitive",
  };
  const { user } = useUser();
  const validationSchema = Yup.object().shape({
    excr_nm: Yup.string().required("This Field is required"),
    excr_notes: Yup.string(),
    excr_units: Yup.string().required("This Field is required"),
    excr_typ: Yup.string().required("This Field is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    console.log(values);
    try {
      const exas = await addExercise({
        coach_prsn_rk: props.coach_prsn_rk,
        excr_nm: values.excr_nm,
        excr_notes: values.excr_notes,
        excr_units: values.excr_units,
        excr_typ: values.excr_typ,
        setErrors,
      });
      console.log({ exas });
      if (exas) {
        setErrors(exas);
        return false;
      }
      alert("Exercise Added Successfully");
      refresh();
      close();
      setSubmitting(false);
      console.log("Done");
      return;
    } catch (error) {
      console.log("Erorororoor");
      setErrors({ submit: error.message });
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
        {({ handleSubmit, isSubmitting, values, setFieldValue, errors }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Field name="excr_nm" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Exercise Name:</FieldLabel>
                  <StyledInput
                    type="text"
                    placeholder={"Name Here"}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="excr_nm" component={SubmitError} />

            <Field name="excr_units" type="number">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Units of Measurement:</FieldLabel>
                  <StyledInput
                    type="text"
                    placeholder={"Name Here"}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="excr_units" component={SubmitError} />

            <Field name="excr_typ" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Exercise Type:</FieldLabel>
                  <select
                    type="text"
                    placeholder={"Type of Excercise"}
                    {...field}
                  >
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
            <ErrorMessage name="excr_typ" component={SubmitError} />

            <Field name="excr_notes" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Notes:</FieldLabel>
                  <StyledInput
                    type="text"
                    placeholder={"Name Here"}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="excr_notes" component={SubmitError} />

            {errors.submit && <SubmitError>{errors.submit}</SubmitError>}
            <StyledButton type="submit" disabled={isSubmitting}>
              Save
            </StyledButton>
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
export default AddExerciseForm;
