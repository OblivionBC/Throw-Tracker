import React from "react";
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
import { programMeasurableAssignmentsApi } from "../../api";
import { useApi } from "../../hooks/useApi";

const EditMeasurableAssignmentForm = ({ close, refresh, measurable }) => {
  const { apiCall } = useApi();
  const initialValues = {
    sort_order: measurable.sort_order || 1,
    target_val: measurable.target_val || "",
    target_reps: measurable.target_reps || "",
    target_sets: measurable.target_sets || "",
    target_weight: measurable.target_weight || "",
    target_unit: measurable.target_unit || measurable.meas_unit || "",
    notes: measurable.notes || "",
    is_measured: measurable.is_measured || false,
  };

  const validationSchema = Yup.object().shape({
    sort_order: Yup.number()
      .min(1, "Sort order must be at least 1")
      .required("Sort order is required"),
    target_val: Yup.number().min(0, "Target value must be 0 or greater"),
    target_reps: Yup.number().min(0, "Target reps must be 0 or greater"),
    target_sets: Yup.number().min(0, "Target sets must be 0 or greater"),
    target_weight: Yup.number().min(0, "Target weight must be 0 or greater"),
    target_unit: Yup.string(),
    notes: Yup.string(),
    is_measured: Yup.boolean(),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      await apiCall(
        () =>
          programMeasurableAssignmentsApi.update(measurable.prma_rk, values),
        "Updating measurable assignment"
      );
      alert("Measurable assignment updated successfully");
      refresh();
      close();
    } catch (error) {
      setErrors({ submit: error.message });
      console.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, isSubmitting, errors, setFieldValue, values }) => (
        <StyledForm onSubmit={handleSubmit}>
          <FieldOutputContainer>
            <FieldLabel>Measurable:</FieldLabel>
            <p>
              {measurable.meas_id} ({measurable.meas_typ})
            </p>
          </FieldOutputContainer>

          <Field name="sort_order">
            {({ field }) => (
              <FieldOutputContainer>
                <FieldLabel>Sort Order:</FieldLabel>
                <StyledInput
                  type="number"
                  min="1"
                  placeholder="Display order"
                  {...field}
                />
              </FieldOutputContainer>
            )}
          </Field>
          <ErrorMessage name="sort_order" component={SubmitError} />

          <Field name="target_val">
            {({ field }) => (
              <FieldOutputContainer>
                <FieldLabel>Target Value:</FieldLabel>
                <StyledInput
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 30 meters, 60 seconds"
                  {...field}
                />
              </FieldOutputContainer>
            )}
          </Field>
          <ErrorMessage name="target_val" component={SubmitError} />

          <Field name="target_reps">
            {({ field }) => (
              <FieldOutputContainer>
                <FieldLabel>Target Reps:</FieldLabel>
                <StyledInput
                  type="number"
                  min="0"
                  placeholder="Number of repetitions"
                  {...field}
                />
              </FieldOutputContainer>
            )}
          </Field>
          <ErrorMessage name="target_reps" component={SubmitError} />

          <Field name="target_sets">
            {({ field }) => (
              <FieldOutputContainer>
                <FieldLabel>Target Sets:</FieldLabel>
                <StyledInput
                  type="number"
                  min="0"
                  placeholder="Number of sets"
                  {...field}
                />
              </FieldOutputContainer>
            )}
          </Field>
          <ErrorMessage name="target_sets" component={SubmitError} />

          <Field name="target_weight">
            {({ field }) => (
              <FieldOutputContainer>
                <FieldLabel>Target Weight:</FieldLabel>
                <StyledInput
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Weight in kg/lbs"
                  {...field}
                />
              </FieldOutputContainer>
            )}
          </Field>
          <ErrorMessage name="target_weight" component={SubmitError} />

          <Field name="target_unit">
            {({ field }) => (
              <FieldOutputContainer>
                <FieldLabel>Target Unit:</FieldLabel>
                <StyledInput
                  type="text"
                  placeholder="e.g., meters, seconds, kg"
                  {...field}
                />
              </FieldOutputContainer>
            )}
          </Field>
          <ErrorMessage name="target_unit" component={SubmitError} />

          <Field name="notes">
            {({ field }) => (
              <FieldOutputContainer>
                <FieldLabel>Notes:</FieldLabel>
                <StyledInput
                  type="text"
                  placeholder="Additional notes"
                  {...field}
                />
              </FieldOutputContainer>
            )}
          </Field>
          <ErrorMessage name="notes" component={SubmitError} />

          <Field name="is_measured">
            {({ field }) => (
              <FieldOutputContainer>
                <FieldLabel>
                  <input
                    type="checkbox"
                    {...field}
                    checked={values.is_measured}
                    onChange={(e) =>
                      setFieldValue("is_measured", e.target.checked)
                    }
                  />{" "}
                  Mark as measured
                </FieldLabel>
              </FieldOutputContainer>
            )}
          </Field>
          <ErrorMessage name="is_measured" component={SubmitError} />

          <StyledButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Measurable"}
          </StyledButton>
          {errors.submit && <SubmitError>{errors.submit}</SubmitError>}
        </StyledForm>
      )}
    </Formik>
  );
};

export default EditMeasurableAssignmentForm;
