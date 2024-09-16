import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import "typeface-nunito";

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
const Blab = styled.div`
  font-family: "Nunito", sans-serif;
  color: blue;
  cursor: pointer;
  text-decoration: underline;
`;
const SubmitError = styled.div`
  font-size: 18;
  color: red;
  font-family: "Nunito", sans-serif;
`;

const Title = styled.h2`
  font-family: "Nunito", sans-serif;
  padding: 0;
  margin: 0;
`;

const LoginForm = ({ on, off }) => {
  const [failed, setFailed] = useState(false);
  const initialValues = {
    username: "",
    password: "",
  };
  const navigate = useNavigate();
  const { login } = useUser();

  const validationSchema = Yup.object().shape({
    username: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    // Handle form submission here
    // For example, you could make an API call to authenticate the user\
    setSubmitting(true);
    const getLogin = async () => {
      setFailed(false);
      const loginSuccess = await login(values);
      if (loginSuccess === true) {
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
  return (
    <>
      <Title>Login</Title>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Field name="username">
              {({ field }) => (
                <StyledInput type="text" placeholder="Email" {...field} />
              )}
            </Field>
            <ErrorMessage name="username" component={SubmitError} />
            <Field name="password">
              {({ field }) => (
                <StyledInput
                  type="password"
                  placeholder="Password"
                  {...field}
                />
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
      <Blab onClick={off}>Sign Up</Blab>
    </>
  );
};

export default LoginForm;
