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
} from "../../styles/design-system";
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
  };

  const validationSchema = Yup.object().shape({
    prog_nm: Yup.string("Must be a string")
      .required("Program Name is required")
      .max(64, "Program name must be 64 characters or less"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      await programsApi.update(program.prog_rk, {
        prog_nm: values.prog_nm,
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
    return <div>Loading...</div>;
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
