import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useUser } from "../contexts/UserContext";
import "typeface-nunito";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditTRPEForm = ({ trpe, refresh, close }) => {
  const [failed, setFailed] = useState(false);
  let startDate = new Date(trpe.trpe_start_dt);
  let trimmedStartDate = startDate.toISOString().split("T")[0];
  let endDate = new Date(trpe.trpe_end_dt);
  let trimmedEndDate = endDate.toISOString().split("T")[0];
  const initialValues = {
    trpe_start_dt: trimmedStartDate,
    trpe_end_dt: trimmedEndDate,
  };
  const { user } = useUser();
  const validationSchema = Yup.object().shape({
    trpe_start_dt: Yup.date("Must be a Date").required(
      "Start Date is Required"
    ),
    trpe_end_dt: Yup.date("Must be a Date"),
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
                  <DatePicker
                    {...field}
                    selected={values.trpe_start_dt}
                    onChange={(trpe_start_dt) =>
                      setFieldValue("trpe_start_dt", trpe_start_dt)
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
                      setFieldValue("trpe_end_dt", trpe_end_dt)
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