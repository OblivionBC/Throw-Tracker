import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useUser } from "../contexts/UserContext";
import "typeface-nunito";

const EditTRPEForm = ({ trpe, refresh, close }) => {
  const [failed, setFailed] = useState(false);
  const initialValues = {
    trpe_start_dt: "",
    trpe_end_dt: "",
  };
  const { user } = useUser();
  const validationSchema = Yup.object().shape({
    trpe_start_dt: Yup.date().required(),
    trpe_end_dt: Yup.date(),
  });
  const handleSubmit = async (values, { setSubmitting }) => {
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
          }),
        }
      );
      refresh();
      setSubmitting(false);
      alert("Training Period Updated Successfully");
      close();
      return;
    } catch (error) {
      setFailed(true);
      console.error(error.message);
      console.log(this.props.errors);
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
        {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
          //date, training period, wind, notes, measurables
          <StyledForm onSubmit={handleSubmit}>
            <h4>Training Period: {trpe.trpe_rk}</h4>
            <Field type="date" name="trpe_start_dt">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Start Date:</FieldLabel>
                  <StyledInput
                    type="date"
                    placeholder={trpe.trpe_dt}
                    {...field}
                  />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="trpe_start_dt" component={SubmitError} />

            <Field type="date" name="trpe_end_dt">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>End Date:</FieldLabel>
                  <StyledInput type="date" {...field} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="trpe_end_dt" component={SubmitError} />

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
export default EditTRPEForm;
