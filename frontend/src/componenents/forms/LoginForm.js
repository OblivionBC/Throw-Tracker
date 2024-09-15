import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

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

const LoginForm = () => {
  const initialValues = {
    username: "",
    password: "",
  };
  const navigate = useNavigate();
  const { login } = useUser();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    // Handle form submission here
    // For example, you could make an API call to authenticate the user\
    setSubmitting(true);
    const getLogin = async () => {
      console.log(JSON.stringify(values.username));
      const loginSuccess = await login(values);
      if (loginSuccess === true) {
        navigate("/home");
      } else {
      }
    };

    getLogin();
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, isSubmitting }) => (
        <StyledForm onSubmit={handleSubmit}>
          <Field name="username">
            {({ field }) => (
              <StyledInput type="text" placeholder="Username" {...field} />
            )}
          </Field>
          <ErrorMessage name="username" component="div" />
          <Field name="password">
            {({ field }) => (
              <StyledInput type="password" placeholder="Password" {...field} />
            )}
          </Field>
          <ErrorMessage name="password" component="div" />
          <StyledButton type="submit" disabled={isSubmitting}>
            Login
          </StyledButton>
        </StyledForm>
      )}
    </Formik>
  );
};

export default LoginForm;
