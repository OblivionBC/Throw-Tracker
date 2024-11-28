import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import "typeface-nunito";
import dayjs from "dayjs";
import { useUser } from "../contexts/UserContext";
import { MeasurableFieldArray } from "./MeasurableFieldArray";
import TrainingPeriodOptions from "../formHelpers/TrainingPeriodOptions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  if (response.ok === false) {
    console.log("ERROR HAS OCCURRED ", response.statusText);
  }
};

const addPractice = async (prac_dt, trpe_rk, prsn_rk) => {
  console.log(prac_dt);
  const response = await fetch(`http://localhost:5000/api//add-practice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prac_dt: prac_dt,
      trpe_rk: trpe_rk,
      prsn_rk: prsn_rk,
    }),
  });
  const jsonData = await response.json();
  if (!response.ok) {
    console.log("ERROR HAS OCCURRED ", response.statusText);
    throw new Error(jsonData.message || "Something went wrong");
  }
  return jsonData.rows[0].prac_rk;
};

const AddPracticeForm = ({ close, refresh }) => {
  const [failed, setFailed] = useState(false);
  const [dateFieldDisabled, setDateFieldDisabled] = useState(true);
  const initialValues = {
    trpe: "",
    date: "",
    measurables: [],
  };
  const { getUser } = useUser();
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
      .required("Must have measurables"),
  });
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // Handle form submission here
    //Make call on submit to update practice, and delete all measurments in for the prac, then create a new one for each in the array
    setSubmitting(true);
    try {
      const prac_rk = await addPractice(values.date, values.trpe, getUser());
      values.measurables.forEach((element) => {
        addMeasurement(element, prac_rk);
      });
      alert("Practice Added Successfully");
      close();
      refresh();
      setSubmitting(false);
      return;
    } catch (error) {
      setErrors({ submit: error.message });
      setFailed(true);
    } finally {
      setSubmitting(false);
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
            <Field name="trpe" type="number">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Training Period:</FieldLabel>
                  <TrainingPeriodOptions prsn_rk={getUser()} name="trpe" />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="trpe" component={SubmitError} />

            <Field name="date">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Date:</FieldLabel>
                  <DatePicker
                    {...field}
                    selected={values.date}
                    disabled={values.trpe === ""}
                    onChange={(date) =>
                      setFieldValue(
                        "date",
                        date ? dayjs(date).format("YYYY-MM-DD") : null
                      )
                    }
                    dateFormat="yyyy-MM-dd"
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="date" component={SubmitError} />

            <MeasurableFieldArray />
            <ErrorMessage name="measurables" component={SubmitError} />

            <StyledButton type="submit" disabled={isSubmitting}>
              Save
            </StyledButton>
            {errors.submit && <SubmitError>{errors.submit}</SubmitError>}
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
export default AddPracticeForm;
