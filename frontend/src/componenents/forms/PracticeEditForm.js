import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useUser } from "../UserContext";
import "typeface-nunito";
import Select from "react-select";
import PersonMeasurableOptions from "../PersonMeasurableOptions";

const PracticeEditForm = ({ prac, on }) => {
  const [failed, setFailed] = useState(false);
  const initialValues = {
    username: "",
    password: "",
    measurables: [],
  };
  const { user } = useUser();
  const validationSchema = Yup.object().shape({
    prac_trpe: Yup.number("Must be a number").required(
      "Training Period is a required field"
    ),
    prac_date: Yup.date().required(),
    prac_wind: Yup.number("Must be a number, km/h will be applied").required(
      "Training Period is a required field"
    ),
    selects: Yup.array().of(
      Yup.object().shape({
        //value: Yup.string().required("Required"),
      })
    ),
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
          prac_trpe: values.trpe,
          prac_date: values.date,
          prac_wind: values.wind,
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
  };

  if (!on) return null;
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, values }) => (
          //date, training period, wind, notes, measurables
          <StyledForm onSubmit={handleSubmit}>
            <Field name="trpe">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Training Period:</FieldLabel>
                  <StyledInput
                    type="text"
                    placeholder={prac.trpe_rk}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="trpe" component={SubmitError} />

            <Field type="date" name="date">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Date:</FieldLabel>
                  <StyledInput
                    type="date"
                    placeholder={prac.prac_dt}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="date" component={SubmitError} />

            <Field name="wind">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Wind:</FieldLabel>
                  <StyledInput
                    type="text"
                    placeholder={prac.prac_wind}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="wind" component={SubmitError} />

            <Field name="measurable">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Measurables:</FieldLabel>
                  <PersonMeasurableOptions prsn_rk={user.prsn_rk} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="measurable" component={SubmitError} />

            <FieldArray name="measurables"></FieldArray>

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
    </>
  );
};

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
const SubmitError = styled.div`
  font-size: 18;
  color: red;
  font-family: "Nunito", sans-serif;
`;

const FieldOutputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const FieldLabel = styled.h3`
  margin-right: 10px;
`;
export default PracticeEditForm;
