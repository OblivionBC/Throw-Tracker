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
import ExerciseSelect from "../formHelpers/ExerciseSelect";
import { exerciseAssignmentsApi } from "../../api";
const EditExerciseAssignmentForm = ({
  excr,
  refresh,
  close,
  athlete_prsn_rk,
}) => {
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
    setSubmitting(true);
    try {
      await exerciseAssignmentsApi.update(excr.exas_rk, values);
      alert("Excersise Updated Successfully");
      close();
      refresh();
      setSubmitting(false);
      return;
    } catch (error) {
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
        {({ handleSubmit, isSubmitting, errors }) => (
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
