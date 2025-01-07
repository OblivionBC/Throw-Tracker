import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  StyledForm,
  StyledButton,
  FieldOutputContainer,
  FieldLabel,
  SubmitError,
  StyledInput,
  ParagraphInput,
} from "../../styles/styles.js";
import "typeface-nunito";
import "react-datepicker/dist/react-datepicker.css";
import { useUser } from "../contexts/UserContext";
import ExerciseSelect from "../formHelpers/ExerciseSelect";

const EditExerciseAssignmentForm = ({
  excr,
  refresh,
  close,
  athlete_prsn_rk,
}) => {
  const { getUser } = useUser();
  const initialValues = {
    exas_notes: excr.exas_notes,
    exas_rk: excr.exas_rk,
    excr_rk: excr.excr_rk,
    exas_reps: excr.exas_reps,
    exas_sets: excr.exas_sets,
    exas_weight: excr.exas_weight,
    is_measurable: excr.is_measurable === "Y",
    add_measurable: excr.is_measurable === false,
  };
  const validationSchema = Yup.object().shape({
    exas_notes: Yup.string("Must be a valid string"),
    excr_rk: Yup.number("Must be a valid Number").required(
      "This Field is required"
    ),
    exas_reps: Yup.number("Must be a valid Number").required(
      "This Field is required"
    ),
    exas_sets: Yup.number("Must be a valid Number").required(
      "This Field is required"
    ),
    exas_weight: Yup.number("Must be a valid Number").required(
      "This Field is required"
    ),
    is_measurable: Yup.bool("Must be a bool"),
  });
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // Handle form submission here
    //Make call on submit to update trpetice, and delete all measurments in for the trpe, then create a new one for each in the array
    setSubmitting(true);
    if (values.trpe_end_dt === "") {
      values.trpe_end_dt = null;
    }
    try {
      console.log(values);
      const response = await fetch(
        `http://localhost:5000/api/update-exerciseAssignment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exas_notes: values.exas_notes,
            excr_rk: values.excr_rk,
            exas_rk: excr.exas_rk,
            athlete_prsn_rk: athlete_prsn_rk,
            exas_reps: values.exas_reps,
            exas_sets: values.exas_sets,
            exas_weight: values.exas_weight,
            is_measurable: values.is_measurable,
            add_measurable:
              initialValues.add_measurable !== values.is_measurable,
          }),
        }
      );
      const jsonData = await response.json();

      //Throw error if the response wasn't clean ( Something went wrong in validations?)
      if (!response.ok) {
        console.log("ERROR HAS OCCURRED ", response.statusText);
        throw new Error(jsonData.message || "Something went wrong");
      }
      refresh();
      setSubmitting(false);
      alert("Excersise Updated Successfully");
      close();
      return;
    } catch (error) {
      //Set error for UI
      setErrors({ submit: error.message });
      console.error(error.message);
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
                  <FieldLabel>Measurable Name:</FieldLabel>
                  <ExerciseSelect name="excr_rk" />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="excr_rk" component={SubmitError} />
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
                  <ParagraphInput type="text" name="exas_notes" {...field} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="exas_notes" component={SubmitError} />
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

export default EditExerciseAssignmentForm;
