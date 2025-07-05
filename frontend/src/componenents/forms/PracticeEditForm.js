import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  StyledForm,
  StyledButton,
  FieldOutputContainer,
  FieldLabel,
  SubmitError,
  ParagraphInput,
} from "../../styles/styles.js";
import "typeface-nunito";
import dayjs from "dayjs";
import { MeasurableFieldArray } from "../formHelpers/MeasurableFieldArray.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TrainingPeriodOptions from "../formHelpers/TrainingPeriodOptions";
import { measurementsApi, practicesApi } from "../../api";

const PracticeEditForm = ({ prac, on, goToDetails, refresh }) => {
  const [measurementContainer, setMeasurementContainer] = useState([]);

  //Grabbing measurements for autofill of the form
  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const measurements = await measurementsApi.getForPractice(prac.prac_rk);
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
    notes: prac.notes,
  };

  const validationSchema = Yup.object().shape({
    trpe: Yup.number("Must be a number").required(
      "Training Period is a required field"
    ),
    date: Yup.date("Must be a valid date").required("Date is required"),
    measurables: Yup.array("Must be an array") //Array of obkjects with a row key and value
      .of(
        Yup.object().shape({
          meas_rk: Yup.number("Must be a number")
            .typeError("Must Be Number")
            .required("Measurable key is required"),
          msrm_value: Yup.number("Must be a Number")
            .typeError("Must Be Number")
            .required("Measurement Value is required"),
        })
      )
      .required("Must have measurables"),
    notes: Yup.string(),
  });
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      await practicesApi.updatePractice(prac.prac_rk, values);
      refresh();
      setSubmitting(false);
      alert("Practice Updated Successfully");
      goToDetails();
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
                  <TrainingPeriodOptions name="trpe" />
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
                  <ParagraphInput
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

export default PracticeEditForm;
