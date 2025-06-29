import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  StyledForm,
  StyledButton,
  StyledInput,
  FieldOutputContainer,
  FieldLabel,
  SubmitError,
  ParagraphInput,
} from "../../styles/styles.js";
import { useUser } from "../contexts/UserContext";
import "typeface-nunito";
import ExerciseSelect from "../formHelpers/ExerciseSelect";
import { exerciseAssignmentsApi } from "../../api";

const addExerciseAssignment = async (props) => {
  const response = await exerciseAssignmentsApi.create(props);
  console.log(response);
  return response.exas_rk;
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
                  <ParagraphInput type="text" name="exas_notes" {...field} />
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

export default AddExerciseAssignmentForm;
