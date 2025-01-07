import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import {
  StyledForm,
  StyledButton,
  FieldOutputContainer,
  FieldLabel,
  SubmitError,
} from "../../styles/styles.js";
import "typeface-nunito";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUser } from "../contexts/UserContext";

const EditTRPEForm = ({ trpe, refresh, close }) => {
  const { getUser } = useUser();
  //Trim the dates to make them work better with the date picker
  let startDate = new Date(trpe.trpe_start_dt);
  let trimmedStartDate = startDate.toISOString().split("T")[0];
  let endDate = new Date(trpe.trpe_end_dt);
  let trimmedEndDate = endDate.toISOString().split("T")[0];
  //Case where there is no end date so we make sure that the end date is not randomized since it was null
  if (trpe.trpe_end_dt === null) trimmedEndDate = null;
  const initialValues = {
    trpe_start_dt: trimmedStartDate,
    trpe_end_dt: trimmedEndDate,
  };
  const validationSchema = Yup.object().shape({
    trpe_start_dt: Yup.date("Must be a Date").required(
      "Start Date is Required"
    ),
    trpe_end_dt: Yup.date("Must be a Date")
      .nullable()
      .test(
        //Make sure the end date is after the start date
        "is-greater",
        "End Date must be greater than Start Date",
        function (value) {
          if (!value) return true;
          return value > endDate;
        }
      ),
  });
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // Handle form submission here
    //Make call on submit to update trpetice, and delete all measurments in for the trpe, then create a new one for each in the array
    setSubmitting(true);
    if (values.trpe_end_dt === "") {
      values.trpe_end_dt = null;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/update-trainingPeriod`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trpe_rk: trpe.trpe_rk,
            trpe_start_dt: values.trpe_start_dt,
            trpe_end_dt: values.trpe_end_dt,
            prsn_rk: getUser(),
          }),
        }
      );
      const jsonData = await response.json();

      //Throw error if the response wasn't clean ( Something went wrong in validations?)
      if (!response.ok) {
        console.log("ERROR HAS OCCURRED ", response.statusText);
        throw new Error(jsonData.message || "Something went wrong");
      }

      //Update the table, and send a success message
      refresh();
      setSubmitting(false);
      alert("Training Period Updated Successfully");
      close();
      return;
    } catch (error) {
      //Set error for UI
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
            <h4>Training Period: {trpe.trpe_rk}</h4>
            <Field type="date" name="trpe_start_dt">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Start Date:</FieldLabel>
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

            <Field type="date" name="trpe_end_dt">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>End Date:</FieldLabel>
                  <DatePicker
                    {...field}
                    selected={values.trpe_end_dt}
                    onChange={(trpe_end_dt) =>
                      setFieldValue(
                        "trpe_end_dt",
                        trpe_end_dt
                          ? dayjs(trpe_end_dt).format("YYYY-MM-DD")
                          : null
                      )
                    }
                    dateFormat="yyyy-MM-dd"
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="trpe_end_dt" component={SubmitError} />

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

export default EditTRPEForm;
