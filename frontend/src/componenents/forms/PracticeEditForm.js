import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useUser } from "../contexts/UserContext";
import "typeface-nunito";
import dayjs from "dayjs";
import { MeasurableFieldArray } from "./MeasurableFieldArray";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TrainingPeriodOptions from "../formHelpers/TrainingPeriodOptions";

//Add a measurement to a given practice
const addMeasurement = async (measurable, prac_rk) => {
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
};
//Grabs measurements to fill the initial values
const findMeasurements = async (prac_rk) => {
  const response = await fetch(
    `http://localhost:5000/api//get-measurementsForPrac`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prac_rk: prac_rk,
      }),
    }
  );
  const jsonData = await response.json();
  return jsonData.rows;
};

//Get rid of the old measurements to make sure no data is left over from the edit
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
};

const PracticeEditForm = ({ prac, on, goToDetails, refresh }) => {
  const [measurementContainer, setMeasurementContainer] = useState([]);

  //Grabbing measurements for autofill of the form
  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const measurements = await findMeasurements(prac.prac_rk);
        const container = measurements.map((element) => ({
          meas_rk: element.meas_rk,
          msrm_value: element.msrm_value,
        }));
        setMeasurementContainer(container);
      } catch (error) {
        console.error("Error fetching measurements:", error);
      }
    };
    fetchMeasurements();
  }, [prac.prac_rk]);

  //Trim date to make it nice and purrrty for the date picker
  let pracDate = new Date(prac.prac_dt);
  let trimmedPracDate = pracDate.toISOString().split("T")[0];
  const initialValues = {
    trpe: prac.trpe_rk,
    date: trimmedPracDate,
    measurables: measurementContainer,
  };
  const { getUser } = useUser();

  const validationSchema = Yup.object().shape({
    trpe: Yup.number("Must be a number").required(
      "Training Period is a required field"
    ),
    date: Yup.date().required(),
    measurables: Yup.array() //Array of obkjects with a row key and value
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
            prsn_rk: getUser(),
          }),
        }
      );
      const jsonData = await response.json();
      //If response didn't come back clean (i.e. Validation or rule error in backend) Throw an error with the message
      if (!response.ok) {
        console.log("ERROR HAS OCCURRED ", response.statusText);
        throw new Error(jsonData.message || "Something went wrong");
      }
      //Delete the old measurements
      deleteMeasurements(prac.prac_rk);
      //Create new measurements
      if (values.measurables.length > 0) {
        values.measurables.forEach((element) => {
          addMeasurement(element, prac.prac_rk);
        });
      }
      //Refresh, return to the detail modal and send a success message
      refresh();
      goToDetails();
      setSubmitting(false);
      alert("Practice Updated Successfully");
      return;
    } catch (error) {
      setSubmitting(false);
      setErrors({ submit: error.message });
      console.error(error.message);
      return false;
    }
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
        {({ handleSubmit, isSubmitting, values, setFieldValue, errors }) => (
          //date, training period, wind, notes, measurables
          <StyledForm onSubmit={handleSubmit}>
            <Field name="trpe">
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

            <Field name="notes" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Notes:</FieldLabel>
                  <StyledInput
                    type="text"
                    placeholder={"Notes Here"}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="notes" component={SubmitError} />

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
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
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
