import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  StyledForm,
  StyledButton,
  StyledInput,
  FieldOutputContainer,
  FieldLabel,
  SubmitError,
} from "../../styles/styles.js";
import "typeface-nunito";
import { measurablesApi } from "../../api";
import useUserStore, { useUser } from "../../stores/userStore";

const addMeasurable = async (meas_id, meas_typ, meas_unit, prsn_rk) => {
  const response = await measurablesApi.create({
    meas_id,
    meas_typ,
    meas_unit,
    prsn_rk,
  });

  return response;
};

const AddMeasurableForm = ({ close, refresh }) => {
  const [failed, setFailed] = useState(false);
  const user = useUser();
  const initialValues = {
    meas_id: "",
    meas_unit: "",
    meas_typ: "",
  };
  const validationSchema = Yup.object().shape({
    meas_id: Yup.string()
      .min(3, "Measurable Name must be at least 5 characters long")
      .required("Measurable Name is required"),
    meas_unit: Yup.string()
      .min(1, "Measurable Unit must be at least 1 characters long")
      .max(15, "Measurable Unit must be 10 characters or less")
      .required("Measurable Unit is required"),
    meas_typ: Yup.string().required("Measurable Type is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // Handle form submission here
    //Make call on submit to update practice, and delete all measurments in for the prac, then create a new one for each in the array
    setSubmitting(true);
    try {
      const measurable = await addMeasurable(
        values.meas_id,
        values.meas_typ,
        values.meas_unit,
        user.id
      );
      alert("Measurable Added Successfully");
      close();
      refresh();
      setSubmitting(false);
      return;
    } catch (error) {
      setFailed(true);
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
            <Field name="meas_id" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Measurable Name:</FieldLabel>
                  <StyledInput
                    type="text"
                    placeholder={"Name Here"}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="meas_id" component={SubmitError} />

            <Field name="meas_unit" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Units:</FieldLabel>
                  <StyledInput
                    type="text"
                    placeholder={"m/s , ft, stones"}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="meas_unit" component={SubmitError} />

            <Field name="meas_typ" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Measurable:</FieldLabel>
                  <select
                    type="text"
                    placeholder={"Type of Measurable"}
                    {...field}
                  >
                    <option value={-1}></option>
                    <option value="Competitive">Competitive</option>
                    <option value="Specific Prepatory">
                      Specific Prepatory
                    </option>
                    <option value="Specific Developmental">
                      Specific Developmental
                    </option>
                    <option value="General">General</option>
                  </select>
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="meas_typ" component={SubmitError} />
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

export default AddMeasurableForm;
