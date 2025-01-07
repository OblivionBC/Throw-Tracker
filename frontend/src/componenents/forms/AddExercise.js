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
