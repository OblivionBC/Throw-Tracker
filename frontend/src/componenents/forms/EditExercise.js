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
import { API_BASE_URL } from "../../config.js";
const EditExerciseForm = ({ props, close, refresh }) => {
  const { getUser } = useUser();
  const initialValues = {
    excr_nm: props.excr_nm,
    excr_notes: props.excr_notes,
    excr_units: props.excr_units,
    excr_typ: props.excr_typ,
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
    // Handle form submission here
    //Make call on submit to update trpetice, and delete all measurments in for the trpe, then create a new one for each in the array
    setSubmitting(true);
    try {
      console.log(values);
      const response = await fetch(`${API_BASE_URL}/api/update-exercise`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          excr_rk: props.excr_rk,
          excr_nm: values.excr_nm,
          excr_notes: values.excr_notes,
          excr_units: values.excr_units,
          excr_typ: values.excr_typ,
        }),
      });
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

export default EditExerciseForm;
