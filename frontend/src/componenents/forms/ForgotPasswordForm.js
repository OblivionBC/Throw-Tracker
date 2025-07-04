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
import { personsApi } from "../../api";
const ForgotPasswordForm = ({ off }) => {
  const initialValues = {
    prsn_first_nm: "",
    prsn_last_nm: "",
    prsn_email: "",
    prsn_pwrd: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    prsn_first_nm: Yup.string().required("First name is required"),
    prsn_last_nm: Yup.string().required("Last Name is required"),
    prsn_email: Yup.string()
      .email("Invalid Email")
      .required("Email is required"),
    prsn_pwrd: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .oneOf([Yup.ref("prsn_pwrd")], "Passwords must match")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      await personsApi.updatePassword(values);
      alert("Password Updated Successfully");
      setSubmitting(false);
      off();
    } catch (error) {
      setErrors({ submit: error.message });
      return false;
    }
  };

  return (
    <>
      <h2>Enter your information to reset the password</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, errors }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Field name="prsn_first_nm">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>First Name: </FieldLabel>
                  <StyledInput type="text" placeholder="Ex: Ryan" {...field} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="prsn_first_nm" component={SubmitError} />

            <Field name="prsn_last_nm">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Last Name: </FieldLabel>
                  <StyledInput
                    type="text"
                    placeholder="Ex: Crouser"
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="prsn_last_nm" component={SubmitError} />

            <Field name="prsn_email">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Email: </FieldLabel>
                  <StyledInput type="text" placeholder="Email" {...field} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="prsn_email" component={SubmitError} />

            <Field name="prsn_pwrd">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>New Password: </FieldLabel>
                  <StyledInput
                    type="password"
                    placeholder="At least 8 Characters"
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="prsn_pwrd" component={SubmitError} />

            <Field name="confirmPassword">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Confirm New Password: </FieldLabel>
                  <StyledInput
                    type="password"
                    placeholder="ConfirmPassword"
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="confirmPassword" component={SubmitError} />

            <StyledButton type="submit" disabled={isSubmitting}>
              Submit
            </StyledButton>
            {errors.submit && <SubmitError>{errors.submit}</SubmitError>}
          </StyledForm>
        )}
      </Formik>
      <StyledButton onClick={off}>Back to Login</StyledButton>
    </>
  );
};

export default ForgotPasswordForm;
