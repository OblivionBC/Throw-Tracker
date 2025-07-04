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
} from "../../styles/styles.js";
import "typeface-nunito";
import { programsApi } from "../../api";

const addProgram = async (prog_nm, coach_prsn_rk, trpe_rk) => {
  const response = await programsApi.create(prog_nm, coach_prsn_rk, trpe_rk);

  const jsonData = await response.json();
  if (!response.ok) {
    throw new Error(jsonData.message || "Something went wrong");
  }
  return jsonData.prog_rk;
};

const AddProgramForm = ({ close, refresh, props }) => {
  const initialValues = {
    prog_nm: undefined,
    coach_prsn_rk: props.prsn_rk,
    trpe_rk: props.trpe_rk,
  };

  const validationSchema = Yup.object().shape({
    prog_nm: Yup.string("Must be a string").required(
      "Program Name is required"
    ),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      const exas = await addProgram(
        values.prog_nm,
        values.coach_prsn_rk,
        values.trpe_rk
      );
      alert("Prgoram Added Successfully");
      refresh();
      close();
      setSubmitting(false);
      return;
    } catch (error) {
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
        {({ handleSubmit, isSubmitting, errors }) => (
          <StyledForm onSubmit={handleSubmit}>
            <FieldLabel>
              Training Period #{initialValues.coach_prsn_rk}
            </FieldLabel>
            <Field name="prog_nm" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Program Name:</FieldLabel>
                  <StyledInput type="text" name="prog_nm" {...field} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="prog_nm" component={SubmitError} />

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

export default AddProgramForm;
