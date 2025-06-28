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
import { useUser } from "../contexts/UserContext";
import "typeface-nunito";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { trainingPeriodsApi } from "../../api";

//Name says it, but this is just a function to add the trpe when submitting
const AddTRPE = async (trpe_start_dt, prsn_rk, endDateRecent) => {
  if (endDateRecent) {
    const dateString = new Date(trpe_start_dt);
    dateString.setDate(dateString.getDate() - 1);
    const newEndDate = dateString.toISOString().split("T")[0];
    await trainingPeriodsApi.getEndDateMostRecent(prsn_rk, newEndDate);
  }

  const response = await trainingPeriodsApi.create(trpe_start_dt, prsn_rk);
  return response.rows[0].trpe_rk;
};
const AddTRPEForm = ({ close, refresh }) => {
  const initialValues = {
    trpe_start_dt: "",
    endDateRecent: false,
  };
  const { getUser } = useUser();
  const validationSchema = Yup.object().shape({
    trpe_start_dt: Yup.date("Must be a date").required(
      "Measurable Name is required"
    ),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // Handle form submission here
    //Make call on submit to update practice, and delete all measurments in for the prac, then create a new one for each in the array
    console.log(values);
    setSubmitting(true);
    try {
      const trpe_rk = await AddTRPE(
        values.trpe_start_dt,
        getUser(),
        values.endDateRecent,
        setErrors
      );
      if (trpe_rk) {
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
export default AddTRPEForm;
