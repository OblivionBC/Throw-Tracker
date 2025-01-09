import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  StyledForm,
  StyledButton,
  FieldOutputContainer,
  FieldLabel,
  SubmitError,
  StyledInput,
} from "../../styles/styles.js";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext.js";
import "typeface-nunito";

const ForgotPasswordForm = ({ off }) => {
  const [failed, setFailed] = useState(false);
  const initialValues = {
    username: "",
    password: "",
  };
  const navigate = useNavigate();
  const { login } = useUser();

  const validationSchema = Yup.object().shape({
    fname: Yup.string().required("First name is required"),
    lname: Yup.string().required("Last Name is required"),
    username: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // Handle form submission here
    // For example, you could make an API call to authenticate the user\
    setSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api//update-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prsn_first_nm: values.fname,
            prsn_last_nm: values.lname,
            prsn_email: values.username,
            prsn_pwrd: values.password,
            prsn_role: values.role,
          }),
        }
      );
      if (response.ok === false) {
        const jsonData = await response.json();
        setErrors({ submit: jsonData.message });
        return;
      }
      console.log(response);

      alert("Submitted");
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

            <Field name="password">
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
            <ErrorMessage name="password" component={SubmitError} />

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
