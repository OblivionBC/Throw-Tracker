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
import "typeface-nunito";
import ForgotPasswordForm from "./ForgotPasswordForm.js";
import { personsApi } from "../../api";

const LoginForm = ({ on, off }) => {
  const [failed, setFailed] = useState(false);
  const [forgot, setForgot] = useState(false);

  const initialValues = {
    username: "",
    password: "",
  };
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string("Must be a string")
      .email("Invalid Email")
      .required("Email is required"),
    password: Yup.string("Must be a string").required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    // Handle form submission here
    // For example, you could make an API call to authenticate the user\
    setSubmitting(true);
    const getLogin = async () => {
      setFailed(false);
      const loginSuccess = await personsApi.login(values);
      if (loginSuccess.prsn_rk) {
        navigate("/home");
      } else {
        setFailed(true);
      }
    };

    getLogin();
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
        {({ handleSubmit, isSubmitting }) => (
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
            {failed ? (
              <SubmitError>
                Either the password or email is incorrect, please try again
              </SubmitError>
            ) : null}
          </StyledForm>
        )}
      </Formik>
      <StyledButton onClick={off}>Sign Up</StyledButton>
      <StyledButton onClick={() => setForgot(true)}>
        Forgot your password?
      </StyledButton>
    </>
  );
};

export default LoginForm;
