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
import "typeface-nunito";
import { exercisesApi } from "../../api";

const AddExerciseForm = ({ close, refresh, prog_rk, coach_prsn_rk, props }) => {
  const initialValues = {
    excr_nm: "",
    excr_notes: "",
    excr_units: "",
    excr_typ: "Competitive",
  };
  const validationSchema = Yup.object().shape({
    excr_nm: Yup.string("Must be a valid string").required(
      "This Field is required"
    ),
    excr_notes: Yup.string("Must be a valid string"),
    excr_units: Yup.string("Must be a valid string").required(
      "This Field is required"
    ),
    excr_typ: Yup.string("Must be a valid string").required(
      "This Field is required"
    ),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    console.log(values);
    try {
      await exercisesApi.create({
        coach_prsn_rk: props.coach_prsn_rk,
        excr_nm: values.excr_nm,
        excr_notes: values.excr_notes,
        excr_units: values.excr_units,
        excr_typ: values.excr_typ,
      });

      alert("Exercise Added Successfully");
      refresh();
      close();
      setSubmitting(false);
      console.log("Done");
      return;
    } catch (error) {
      console.log("Error occurred");
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
                  <ParagraphInput
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

export default AddExerciseForm;
