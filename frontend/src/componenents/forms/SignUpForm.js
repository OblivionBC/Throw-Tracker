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
const Blab = styled.div`
  font-family: "Nunito", sans-serif;
  color: blue;
  cursor: pointer;
  text-decoration: underline;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
const SubmitError = styled.div`
  font-size: 18;
  color: red;
  font-family: "Nunito", sans-serif;
`;

const StyledSelect = styled.select`
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const SignUpForm = ({ on, off }) => {
  const [failed, setFailed] = useState(false);
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    fname: Yup.string().required("First name is required"),
    lname: Yup.string().required("Password is required"),
    username: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    org: Yup.number("Must be a Valid Number").required("Org Key is required"),
    confirmPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    // Handle form submission here
    // For example, you could make an API call to authenticate the user\
    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api//add-person`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prsn_first_nm: values.fname,
          prsn_last_nm: values.lname,
          prsn_email: values.username,
          prsn_pwrd: values.password,
          org_rk: values.org,
          prsn_role: values.role,
        }),
      });
      const jsonData = await response.json();
      if (jsonData.rowCount === 0) {
        setFailed(true);
        return;
      } else {
      }
    } catch (error) {
      setFailed(true);
      console.error(error.message);
      return false;
    }
    alert("Submitted");
    setSubmitting(false);
    off();
  };
  console.log(on);
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
        {({ handleSubmit, isSubmitting }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Field name="fname">
              {({ field }) => (
                <StyledInput
                  type="text"
                  placeholder="First Name Ex: Ryan"
                  {...field}
                />
              )}
            </Field>
            <ErrorMessage name="fname" component={SubmitError} />

            <Field name="lname">
              {({ field }) => (
                <StyledInput
                  type="text"
                  placeholder="Last Name Ex: Crouser"
                  {...field}
                />
              )}
            </Field>
            <ErrorMessage name="lname" component={SubmitError} />

            <Field name="username">
              {({ field }) => (
                <StyledInput type="text" placeholder="Email" {...field} />
              )}
            </Field>
            <ErrorMessage name="username" component={SubmitError} />

            <Field name="org">
              {({ field }) => (
                <StyledInput
                  type="text"
                  placeholder="Organization Key"
                  {...field}
                />
              )}
            </Field>
            <ErrorMessage name="org" component={SubmitError} />

            <Field as="select" name="role">
              {({ field }) => (
                <StyledSelect type="password" placeholder="Password" {...field}>
                  <option value="COACH">Coach</option>
                  <option value="ATHLETE">Athlete</option>
                </StyledSelect>
              )}
            </Field>
            <ErrorMessage name="role" component={SubmitError} />

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

            <Field name="confirmPassword">
              {({ field }) => (
                <StyledInput
                  type="password"
                  placeholder="ConfirmPassword"
                  {...field}
                />
              )}
            </Field>
            <ErrorMessage name="confirmPassword" component={SubmitError} />

            <StyledButton type="submit" disabled={isSubmitting}>
              Sign Up
            </StyledButton>
            {failed ? (
              <SubmitError>
                Something went wrong, please try again later
              </SubmitError>
            ) : null}
          </StyledForm>
        )}
      </Formik>
      <Blab onClick={off}>Back to Login</Blab>
    </>
  );
};

export default SignUpForm;
