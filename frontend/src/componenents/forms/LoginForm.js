import React, { useState } from "react";
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
} from "../../styles/design-system";
import { useNavigate, useLocation } from "react-router-dom";
import "typeface-nunito";
import ForgotPasswordForm from "./ForgotPasswordForm.js";
import useUserStore, { useError } from "../../stores/userStore";

const LoginForm = ({ on, off }) => {
  const [failed, setFailed] = useState(false);
  const [forgot, setForgot] = useState(false);
  const error = useError();
  const { login, clearError } = useUserStore();

  const navigate = useNavigate();
  const location = useLocation();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string("Must be a string")
      .email("Invalid Email")
      .required("Email is required"),
    password: Yup.string("Must be a string").required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    setFailed(false);
    clearError();

    try {
      const userData = await login(values);
      if (userData) {
        // Redirect to the intended page or home
        const from = location.state?.from?.pathname || "/home";
        navigate(from, { replace: true });
      } else {
        setFailed(true);
        setErrors({ submit: "Login failed. Please check your credentials." });
      }
    } catch (err) {
      console.error("Login error - Full object:", err);
      console.error("Login error - Message:", err.message);
      console.error("Login error - Status:", err.status);
      console.error("Login error - Code:", err.code);
      console.error("Login error - Response:", err.response);
      setFailed(true);
      setErrors({
        submit:
          err.message ||
          "Either the password or email is incorrect, please try again",
      });
    }

    setSubmitting(false);
  };
  if (!on) {
    return null;
  }
  if (forgot) {
    return (
      <ForgotPasswordForm off={() => setForgot(false)}></ForgotPasswordForm>
    );
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
                  <FieldLabel>Password: </FieldLabel>
                  <StyledInput
                    type="password"
                    placeholder="Password"
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="password" component={SubmitError} />
            <StyledButton type="submit" disabled={isSubmitting}>
              Login
            </StyledButton>
            {(failed || error || errors.submit) && (
              <SubmitError>
                {errors.submit ||
                  error ||
                  "Either the password or email is incorrect, please try again"}
              </SubmitError>
            )}
          </StyledForm>
        )}
      </Formik>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <CancelButton onClick={off}>Sign Up</CancelButton>
        <CancelButton onClick={() => setForgot(true)}>
          Forgot your password?
        </CancelButton>
      </div>
    </>
  );
};

export default LoginForm;
