import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useUser } from "../contexts/UserContext";
import "typeface-nunito";

const EditMeasurableForm = ({ measObj, refresh, close }) => {
  const [failed, setFailed] = useState(false);
  const initialValues = {
    meas_id: measObj.meas_id,
    meas_typ: measObj.meas_typ,
    meas_unit: measObj.meas_unit,
  };
  const { user } = useUser();
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
      console.log(user.prsn_rk);
      console.log(values);

      const response = await fetch(
        `http://localhost:5000/api/update-measurable`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meas_id: values.meas_id,
            meas_typ: values.meas_typ,
            meas_unit: values.meas_unit,
            meas_rk: measObj.meas_rk,
            prsn_rk: user.prsn_rk,
          }),
        }
      );
      refresh();
      alert("Measurable Edited Successfully");
      close();
    } catch (error) {
      setFailed(true);
      console.error(error.message);
      console.log(this.props.errors);
    }
    setSubmitting(false);
    return;
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
        {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
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
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
export default EditMeasurableForm;
