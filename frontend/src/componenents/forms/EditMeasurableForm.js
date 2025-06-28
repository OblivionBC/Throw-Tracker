import React, { useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  StyledForm,
  StyledButton,
  FieldOutputContainer,
  FieldLabel,
  SubmitError,
  StyledInput,
} from "../../styles/styles.js";
import "typeface-nunito";
import { measurablesApi } from "../../api";
const EditMeasurableForm = ({ measObj, refresh, close }) => {
  const [failed, setFailed] = useState(false);
  const initialValues = {
    meas_id: measObj.meas_id,
    meas_typ: measObj.meas_typ,
    meas_unit: measObj.meas_unit,
  };
  const validationSchema = Yup.object().shape({
    meas_id: Yup.string("Must be a string").required(
      "Measurable Name is a Required Field"
    ),
    meas_typ: Yup.string("Must be a string").required(
      "Measurable Type is a Required Field"
    ),
    meas_unit: Yup.string("Must be a string").required(
      "Measurable Unit is a Required Field"
    ),
  });
  const handleSubmit = async (values, { setSubmitting }) => {
    // Handle form submission here
    //Make call on submit to update trpetice, and delete all measurments in for the trpe, then create a new one for each in the array
    console.log(values);
    setSubmitting(true);
    try {
      await measurablesApi.update(measObj.meas_rk, values);
      alert("Measurable Edited Successfully");
      close();
      refresh();
      return;
    } catch (error) {
      setFailed(true);
      console.error(error.message);
    }
    setSubmitting(false);
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
        {({ handleSubmit, isSubmitting }) => (
          //date, training period, wind, notes, measurables
          <StyledForm onSubmit={handleSubmit}>
            <Field type="string" name="meas_id">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Measurable Name:</FieldLabel>
                  <StyledInput type="text" {...field} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="meas_id" component={SubmitError} />

            <Field name="meas_typ" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Measurable Type:</FieldLabel>
                  <select type="text" {...field}>
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

            <Field type="text" name="meas_unit">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Measurable Units:</FieldLabel>
                  <StyledInput type="text" {...field} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="meas_unit" component={SubmitError} />

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

export default EditMeasurableForm;
