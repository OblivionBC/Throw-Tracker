import React, { useEffect, useState } from "react";
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
import { useUser } from "../contexts/UserContext";
import { MeasurableFieldArray } from "../formHelpers/MeasurableFieldArray.js";
import TrainingPeriodOptions from "../formHelpers/TrainingPeriodOptions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProgramSelectWithExercise from "../formHelpers/ProgramSelectWithExercise";
import { practicesApi, measurementsApi } from "../../api";

//Grab the initial values
const addMeasurement = async (measurable, prac_rk) => {
  const response = await measurementsApi.create(measurable, prac_rk);
  const jsonData = await response.json();
  if (response.ok === false) {
    console.log("ERROR HAS OCCURRED ", response.statusText);
  }
};

const addPractice = async (prac_dt, trpe_rk, prsn_rk, notes) => {
  const response = await practicesApi.create(prac_dt, trpe_rk, prsn_rk, notes);

  const jsonData = await response.json();
  if (!response.ok) {
    console.log("ERROR HAS OCCURRED ", response.statusText);
    throw new Error(jsonData.message || "Something went wrong");
  }
  return jsonData.rows[0].prac_rk;
};

const AddPracticeForm = ({ close, refresh }) => {
  const [failed, setFailed] = useState(false);
  const [programData, setProgramData] = useState([]);
  let formikRef = null;

  useEffect(() => {
    let defaultMeasurables = [];
    programData?.forEach((row) => {
      defaultMeasurables.push({ meas_rk: row.meas_rk, msrm_value: 0 });
    });
    if (formikRef) {
      formikRef.setFieldValue("measurables", defaultMeasurables);
    }
  }, [programData, formikRef]);
  const initialValues = {
    trpe: "",
    date: "",
    measurables: [],
    notes: "",
  };
  const { getUser } = useUser();
  const validationSchema = Yup.object().shape({
    trpe: Yup.number("Must be a number").required(
      "Training Period is a required field"
    ),
    date: Yup.date("Must be a valid Date").required("Date is required"),
    measurables: Yup.array("Must be an array")
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
  });
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // Handle form submission here
    //Make call on submit to update practice, and delete all measurments in for the prac, then create a new one for each in the array
    setSubmitting(true);
    try {
      const prac_rk = await addPractice(
        values.date,
        values.trpe,
        getUser(),
        values.notes
      );
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
        innerRef={(formik) => (formikRef = formik)}
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

            <ProgramSelectWithExercise
              trpe_rk={values.trpe}
              disabled={values.trpe === ""}
              setData={setProgramData}
            />
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

export default AddPracticeForm;
