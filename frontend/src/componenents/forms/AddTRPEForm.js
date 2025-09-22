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
} from "../../styles/design-system";
import "typeface-nunito";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { trainingPeriodsApi } from "../../api";
import { useApi } from "../../hooks/useApi";
import useUserStore from "../../stores/userStore";
import { useIsCoach } from "../../stores/userStore";
import Logger from "../../utils/logger";

//Name says it, but this is just a function to add the trpe when submitting
const addTRPE = async (trpe_start_dt, targetPrsnRk, apiCall) => {
  const response = await apiCall(
    () => trainingPeriodsApi.create({ trpe_start_dt, prsn_rk: targetPrsnRk }),
    "Creating training period"
  );
  return response.trpe_rk;
};
const AddTRPEForm = ({ close, refresh }) => {
  const { apiCall } = useApi();
  const isCoach = useIsCoach();
  const { selectedAthlete, getUserId } = useUserStore();

  // Determine target person ID: if coach, use selected athlete; if athlete, use current user
  const targetPrsnRk = isCoach ? selectedAthlete : getUserId();
  const initialValues = {
    trpe_start_dt: "",
    endDateRecent: false,
  };
  const validationSchema = Yup.object().shape({
    trpe_start_dt: Yup.date("Must be a date").required(
      "Measurable Name is required"
    ),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // Handle form submission here
    //Make call on submit to update practice, and delete all measurments in for the prac, then create a new one for each in the array

    setSubmitting(true);
    try {
      const trpe_rk = await addTRPE(
        values.trpe_start_dt,
        targetPrsnRk,
        apiCall
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
      Logger.error(error.message);
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
