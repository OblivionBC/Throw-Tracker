import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import styled from "styled-components";
import { useUser } from "../contexts/UserContext";
import "typeface-nunito";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//Name says it, but this is just a function to add the trpe when submitting
const AddTRPE = async (trpe_start_dt, prsn_rk, endDateRecent) => {
  if (endDateRecent) {
    const dateString = new Date(trpe_start_dt);
    dateString.setDate(dateString.getDate() - 1);
    const newEndDate = dateString.toISOString().split("T")[0];

    const response = await fetch(
      `http://localhost:5000/api//endDateMostRecent_trainingPeriod`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }, //meas_id, meas_typ, meas_unit, prsn_rk
        body: JSON.stringify({
          prsn_rk: prsn_rk,
          trpe_end_dt: newEndDate,
        }),
      }
    );
  }
  console.log(prsn_rk);
  const response = await fetch(`http://localhost:5000/api/add-trainingPeriod`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trpe_start_dt: trpe_start_dt,
      prsn_rk: prsn_rk,
    }),
  });
  const jsonData = await response.json();
  //Throw error if the response wasn't clean ( Something went wrong in validations?)
  if (!response.ok) {
    console.log("ERROR HAS OCCURRED ", response.statusText);
    throw new Error(jsonData.message || "Something went wrong");
  }
  return true;
};
const AddTRPEForm = ({ close, refresh }) => {
  const initialValues = {
    trpe_start_dt: "",
    endDateRecent: false,
  };
  const { getUser } = useUser();
  const validationSchema = Yup.object().shape({
    trpe_start_dt: Yup.date().required("Measurable Name is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // Handle form submission here
    //Make call on submit to update practice, and delete all measurments in for the prac, then create a new one for each in the array
    console.log(values);
    setSubmitting(true);
    try {
      const bAdded = await AddTRPE(
        values.trpe_start_dt,
        getUser(),
        values.endDateRecent,
        setErrors
      );
      if (bAdded) {
        alert("Training Period Added Successfully");
        close();
        refresh();
      }
      setSubmitting(false);
      return;
    } catch (error) {
      setErrors({ submit: error.message });
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
        {({ handleSubmit, isSubmitting, values, setFieldValue, errors }) => (
          //date, training period, wind, notes, measurables
          <StyledForm onSubmit={handleSubmit}>
            <Field name="trpe_start_dt" type="date">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Training Period Start Date:</FieldLabel>
                  <DatePicker
                    {...field}
                    selected={values.trpe_start_dt}
                    onChange={(trpe_start_dt) =>
                      setFieldValue(
                        "trpe_start_dt",
                        trpe_start_dt
                          ? dayjs(trpe_start_dt).format("YYYY-MM-DD")
                          : null
                      )
                    }
                    dateFormat="yyyy-MM-dd"
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="trpe_start_dt" component={SubmitError} />

            <FieldOutputContainer>
              <FieldLabel>End date the most recent training period?</FieldLabel>
              <Field name="endDateRecent" type="checkbox" />
            </FieldOutputContainer>

            <StyledButton type="submit" disabled={isSubmitting}>
              Save
            </StyledButton>
            {errors.submit && <SubmitError>{errors.submit}</SubmitError>}
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
