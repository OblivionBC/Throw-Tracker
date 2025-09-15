import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  StyledForm,
  StyledButton,
  CancelButton,
  FieldOutputContainer,
  FieldLabel,
  SubmitError,
  StyledInput,
  StyledSelect,
} from "../../styles/design-system";
import "typeface-nunito";
import { authApi } from "../../api";

const SignUpForm = ({ on, off }) => {
  const initialValues = {
    fname: "",
    lname: "",
    username: "",
    password: "",
    org: "",
    role: "",
  };

  const validationSchema = Yup.object().shape({
    fname: Yup.string().required("First name is required"),
    lname: Yup.string().required("Last Name is required"),
    username: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)"
      )
      .required("Password is required"),
    org: Yup.number("Must be a Valid Number").required("Org Key is required"),
    confirmPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Password is required"),
    role: Yup.string()
      .required("Role is Required")
      .oneOf(["COACH", "ATHLETE"], "Invalid Role"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      await authApi.signup(values);
      alert("User Created Successfully");
      setSubmitting(false);
      off();
    } catch (error) {
      setErrors({ submit: error.message });
      console.error(error.message);
    }
  };
  if (!on) {
    return null;
  }
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, errors }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Field name="fname">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>First Name: </FieldLabel>
                  <StyledInput type="text" placeholder="Ex: Ryan" {...field} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="fname" component={SubmitError} />

            <Field name="lname">
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
            <ErrorMessage name="lname" component={SubmitError} />

            <Field name="username">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Email: </FieldLabel>
                  <StyledInput type="text" placeholder="Email" {...field} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="username" component={SubmitError} />

            <Field name="org">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Organization Key: </FieldLabel>
                  <StyledInput
                    type="text"
                    placeholder="Organization Key"
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="org" component={SubmitError} />

            <Field name="role">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Role: </FieldLabel>
                  <StyledSelect {...field}>
                    <option value=""></option>
                    <option value="COACH">Coach</option>
                    <option value="ATHLETE">Athlete</option>
                  </StyledSelect>
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="role" component={SubmitError} />

            <Field name="password">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Password: </FieldLabel>
                  <StyledInput
                    type="password"
                    placeholder="At least 8 Characters"
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="password" component={SubmitError} />

            <Field name="confirmPassword">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Confirm Password: </FieldLabel>
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
              Sign Up
            </StyledButton>
            {errors.submit && <SubmitError>{errors.submit}</SubmitError>}
          </StyledForm>
        )}
      </Formik>
      <div style={{ marginTop: "20px" }}>
        <CancelButton onClick={off}>Back to Login</CancelButton>
      </div>
    </>
  );
};

export default SignUpForm;
