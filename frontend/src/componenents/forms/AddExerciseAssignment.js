import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useUser } from "../contexts/UserContext";
import "typeface-nunito";
import ExerciseSelect from "../formHelpers/ExerciseSelect";
const addExerciseAssignment = async (props) => {
  console.log("Adding");
  const response = await fetch(
    `http://localhost:5000/api/add-exerciseAssignment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, //meas_id, meas_typ, meas_unit, prsn_rk
      body: JSON.stringify({
        prog_rk: props.prog_rk,
        athlete_prsn_rk: props.athlete_prsn_rk,
        assigner_prsn_rk: props.assigner_prsn_rk,
        exas_notes: props.exas_notes,
        excr_rk: props.excr_rk,
        exas_reps: props.exas_reps,
        exas_sets: props.exas_sets,
        exas_weight: props.exas_weight,
        is_measurable: props.is_measurable,
      }),
    }
  );
  console.log("Past");
  console.log(response);
  const jsonData = await response.json();
  console.log(jsonData);
  if (response.ok === false) {
    console.log("Error?");
    console.log("ERROR HAS OCCURRED ", response.statusText);
  }
  return jsonData.rows[0].prac_rk;
};

const AddExerciseAssignmentForm = ({
  close,
  refresh,
  prog_rk,
  athlete_prsn_rk,
}) => {
  const initialValues = {
    exas_notes: "",
    excr_rk: undefined,
    exas_reps: 0,
    exas_sets: 0,
    exas_weight: 0,
    is_measurable: false,
  };
  const { user } = useUser();
  const validationSchema = Yup.object().shape({
    exas_notes: Yup.string(),
    excr_rk: Yup.number().required("This Field is required"),
    exas_reps: Yup.number().required("This Field is required"),
    exas_sets: Yup.number().required("This Field is required"),
    exas_weight: Yup.number().required("This Field is required"),
    is_measurable: Yup.bool(),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    console.log(values);
    try {
      const exas = addExerciseAssignment({
        assigner_prsn_rk: user.prsn_rk,
        prog_rk: prog_rk,
        athlete_prsn_rk: athlete_prsn_rk,
        exas_notes: values.exas_notes,
        excr_rk: values.excr_rk,
        exas_reps: values.exas_reps,
        exas_sets: values.exas_sets,
        exas_weight: values.exas_weight,
        is_measurable: values.is_measurable,
      });
      console.log(exas);
      alert("Exercise Assignment Added Successfully");
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
            <Field name="excr_rk" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Exercise Name:</FieldLabel>
                  <ExerciseSelect name="excr_rk" />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="excr_rk" component={SubmitError} />

            <Field name="exas_reps" type="number">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Reps:</FieldLabel>
                  <StyledInput
                    type="number"
                    placeholder={"Name Here"}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="exas_reps" component={SubmitError} />

            <Field name="exas_sets" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Sets:</FieldLabel>
                  <StyledInput
                    type="text"
                    placeholder={"Name Here"}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="exas_sets" component={SubmitError} />

            <Field name="exas_weight" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Weight:</FieldLabel>
                  <StyledInput
                    type="number"
                    placeholder={"Name Here"}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="exas_weight" component={SubmitError} />
            <FieldOutputContainer>
              <FieldLabel>Will it be Measured?</FieldLabel>
              <Field name="is_measurable" type="checkbox" />
            </FieldOutputContainer>

            <ErrorMessage name="is_measurable" component={SubmitError} />

            <Field name="exas_notes" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Notes:</FieldLabel>
                  <StyledInput type="text" name="exas_notes" {...field} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="exas_notes" component={SubmitError} />
            {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
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
export default AddExerciseAssignmentForm;
