import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useUser } from "../contexts/UserContext";
import "typeface-nunito";
import { MeasurableFieldArray } from "../MeasurableFieldArray";

//Grab the initial values
const addMeasurement = async (measurable, prac_rk) => {
  console.log(measurable.meas_rk);
  const response = await fetch(`http://localhost:5000/api/add-measurement`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      meas_rk: measurable.meas_rk,
      msrm_value: measurable.msrm_value,
      prac_rk: prac_rk,
    }),
  });
  const jsonData = await response.json();
  console.log(jsonData);
};

const deleteMeasurements = async (prac_rk) => {
  const response = await fetch(
    `http://localhost:5000/api//delete-measurements-for-practice`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prac_rk: prac_rk,
      }),
    }
  );
  const jsonData = await response.json();
  console.log(jsonData);
};

const PracticeEditForm = ({ prac, on, goToDetails }) => {
  const [failed, setFailed] = useState(false);
  const initialValues = {
    trpe: "",
    date: "",
    measurables: [],
  };
  const { user } = useUser();
  const validationSchema = Yup.object().shape({
    trpe: Yup.number("Must be a number").required(
      "Training Period is a required field"
    ),
    date: Yup.date().required(),
    measurables: Yup.array()
      .of(
        Yup.object().shape({
          meas_rk: Yup.number("Must be a number")
            .typeError("Must Be Number")
            .required(),
          msrm_value: Yup.number("Must be a Number")
            .typeError("Must Be Number")
            .required(),
        })
      )
      .required("Must have measurables")
      .min(1, "Minimum of 1 measurable"),
  });
  const handleSubmit = async (values, { setSubmitting }) => {
    // Handle form submission here
    //Make call on submit to update practice, and delete all measurments in for the prac, then create a new one for each in the array

    setSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/update-practice`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trpe_rk: values.trpe,
            prac_dt: values.date,
            prac_rk: prac.prac_rk,
          }),
        }
      );

      deleteMeasurements(prac.prac_rk);
      values.measurables.forEach((element) => {
        addMeasurement(element, prac.prac_rk);
        console.log("POSTING");
      });

      alert("Practice Updated Successfully");
      goToDetails();
      setSubmitting(false);
      return;
    } catch (error) {
      setFailed(true);
      console.error(error.message);
      console.log(this.props.errors);
      return false;
    }
    setSubmitting(false);
  };
  if (!on) return null;
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
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

            <MeasurableFieldArray />
            <ErrorMessage name="measurables" component={SubmitError} />
            <ErrorMessage name="measurables.meas_rk" component={SubmitError} />
            <ErrorMessage
              name="measurables.msrm_value"
              component={SubmitError}
            />

            <StyledButton type="submit" disabled={isSubmitting}>
              Save
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
