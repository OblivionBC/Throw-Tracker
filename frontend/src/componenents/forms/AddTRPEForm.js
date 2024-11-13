import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useUser } from "../contexts/UserContext";
import "typeface-nunito";
const AddTRPE = async (trpe_start_dt, trpe_end_dt, prsn_rk, endDateRecent) => {
  console.log(endDateRecent);
  if (endDateRecent) {
    let newDate = new Date(trpe_start_dt);
    const firstDayOfMonth = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      1
    );
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 1);

    const response = await fetch(
      `http://localhost:5000/api//endDateMostRecent_trainingPeriod`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }, //meas_id, meas_typ, meas_unit, prsn_rk
        body: JSON.stringify({
          prsn_rk: prsn_rk,
          trpe_end_dt: firstDayOfMonth,
        }),
      }
    );
  }

  const response = await fetch(
    `http://localhost:5000/api//add-trainingPeriod`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, //meas_id, meas_typ, meas_unit, prsn_rk
      body: JSON.stringify({
        trpe_start_dt: trpe_start_dt,
        trpe_end_dt: trpe_end_dt,
        prsn_rk: prsn_rk,
      }),
    }
  );
  const jsonData = await response.json();
  console.log(jsonData);
  if (response.ok === false) {
    console.log("ERROR HAS OCCURRED ", response.statusText);
  }
  return jsonData.rows[0].prac_rk;
};

const AddTRPEForm = ({ close, refresh }) => {
  const [failed, setFailed] = useState(false);
  const initialValues = {
    trpe_start_dt: "",
    trpe_end_dt: "",
    endDateRecent: false,
  };
  const { user } = useUser();
  const validationSchema = Yup.object().shape({
    trpe_start_dt: Yup.date().required("Measurable Name is required"),
    trpe_end_dt: Yup.date(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    // Handle form submission here
    //Make call on submit to update practice, and delete all measurments in for the prac, then create a new one for each in the array
    console.log(values);
    setSubmitting(true);
    try {
      const trpe = await AddTRPE(
        values.trpe_start_dt,
        values.trpe_end_dt,
        user.prsn_rk,
        values.endDateRecent
      );
      console.log(trpe);
      alert("Training Period Added Successfully");
      close();
      refresh();
      setSubmitting(false);
      return;
    } catch (error) {
      setFailed(true);
      console.error(error.message);
      return false;
    }
  };
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
            <Field name="trpe_start_dt" type="date">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Training Period Start Date:</FieldLabel>
                  <StyledInput type="date" {...field} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="trpe_start_dt" component={SubmitError} />

            <Field name="trpe_end_dt" type="date">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Training Period End Date:</FieldLabel>
                  <StyledInput type="date" {...field} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="trpe_end_dt" component={SubmitError} />

            <FieldOutputContainer>
              <FieldLabel>End date the most recent training period?</FieldLabel>
              <Field name="endDateRecent" type="checkbox" />
            </FieldOutputContainer>

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
  background: linear-gradient(45deg, darkblue 30%, skyblue 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 10px;
  margin-top: 10px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
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
export default AddTRPEForm;
