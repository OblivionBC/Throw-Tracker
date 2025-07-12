import React, { useState, useEffect } from "react";
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
import { programsApi, trainingPeriodsApi } from "../../api";

const EditProgramForm = ({ close, refresh, program }) => {
  const [trainingPeriods, setTrainingPeriods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainingPeriods = async () => {
      try {
        const response = await trainingPeriodsApi.getAllForPerson();
        setTrainingPeriods(response);
      } catch (error) {
        console.error("Error fetching training periods:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainingPeriods();
  }, []);

  const initialValues = {
    prog_nm: program?.prog_nm || "",
    trpe_rk: program?.trpe_rk || "",
  };

  const validationSchema = Yup.object().shape({
    prog_nm: Yup.string("Must be a string")
      .required("Program Name is required")
      .max(64, "Program name must be 64 characters or less"),
    trpe_rk: Yup.number("Must be a valid number").required(
      "Training Period is required"
    ),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      await programsApi.update(program.prog_rk, {
        prog_nm: values.prog_nm,
        trpe_rk: parseInt(values.trpe_rk),
      });
      alert("Program Updated Successfully");
      refresh();
      close();
      setSubmitting(false);
      return;
    } catch (error) {
      setErrors({ submit: error.message });
      console.error(error.message);
      return false;
    }
  };

  if (loading) {
    return <div>Loading training periods...</div>;
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, errors }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Field name="prog_nm" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Program Name:</FieldLabel>
                  <StyledInput type="text" name="prog_nm" {...field} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="prog_nm" component={SubmitError} />

            <Field name="trpe_rk">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Training Period:</FieldLabel>
                  <select
                    {...field}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Select Training Period</option>
                    {trainingPeriods.map((trpe) => (
                      <option key={trpe.trpe_rk} value={trpe.trpe_rk}>
                        {new Date(trpe.trpe_start_dt).toLocaleDateString()} -
                        {trpe.trpe_end_dt
                          ? new Date(trpe.trpe_end_dt).toLocaleDateString()
                          : "Active"}
                      </option>
                    ))}
                  </select>
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="trpe_rk" component={SubmitError} />

            {errors.submit && <SubmitError>{errors.submit}</SubmitError>}
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <StyledButton type="submit" disabled={isSubmitting}>
                Save
              </StyledButton>
              <StyledButton type="button" onClick={close}>
                Cancel
              </StyledButton>
            </div>
          </StyledForm>
        )}
      </Formik>
    </>
  );
};

export default EditProgramForm;
