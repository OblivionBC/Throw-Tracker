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
import { useUser } from "../contexts/UserContext";
import "typeface-nunito";
import { API_BASE_URL } from "../../config.js";

const AddProgram = async (props) => {
  const response = await fetch(`${API_BASE_URL}/api/add-program`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prog_nm: props.prog_nm,
      coach_prsn_rk: props.coach_prsn_rk,
      trpe_rk: props.trpe_rk,
    }),
  });
  console.log(response);
  const jsonData = await response.json();
  console.log(jsonData);
  if (response.ok === false) {
    console.log("Error?");
    console.log("ERROR HAS OCCURRED ", response.statusText);
  }
};

const AddProgramForm = ({ close, refresh, props }) => {
  console.log(props);
  const { user } = useUser();
  const initialValues = {
    prog_nm: undefined,
    coach_prsn_rk: user.prsn_rk,
    trpe_rk: props.trpe_rk,
  };

  const validationSchema = Yup.object().shape({
    prog_nm: Yup.string("Must be a string").required(
      "Program Name is required"
    ),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    console.log(values);
    try {
      const exas = AddProgram({
        prog_nm: values.prog_nm,
        coach_prsn_rk: values.coach_prsn_rk,
        trpe_rk: values.trpe_rk,
      });
      console.log(exas);
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
