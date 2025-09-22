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
import { programsApi, measurablesApi } from "../../api";
import { useApi } from "../../hooks/useApi";
import Logger from "../../utils/logger";

const AddProgramForm = ({ close, refresh, onProgramCreated }) => {
  const [measurables, setMeasurables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  useEffect(() => {
    const fetchMeasurables = async () => {
      try {
        const response = await apiCall(
          () => measurablesApi.getForCoach(),
          "Fetching measurables"
        );
        setMeasurables(response);
      } catch (error) {
        Logger.error("Error fetching measurables:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeasurables();
  }, [apiCall]);

  const initialValues = {
    prog_nm: "",
    measurables: [
      {
        meas_rk: "",
        sort_order: 1,
        target_val: "",
        target_reps: "",
        target_sets: "",
        target_weight: "",
        target_unit: "",
        notes: "",
        is_measured: false,
      },
    ],
  };

  const validationSchema = Yup.object().shape({
    prog_nm: Yup.string("Must be a string")
      .required("Program Name is required")
      .max(64, "Program name must be 64 characters or less"),
    measurables: Yup.array()
      .of(
        Yup.object().shape({
          meas_rk: Yup.number().required("Measurable is required"),
          sort_order: Yup.number()
            .min(1, "Sort order must be at least 1")
            .required("Sort order is required"),
          target_val: Yup.number().min(0, "Target value must be 0 or greater"),
          target_reps: Yup.number().min(0, "Target reps must be 0 or greater"),
          target_sets: Yup.number().min(0, "Target sets must be 0 or greater"),
          target_weight: Yup.number().min(
            0,
            "Target weight must be 0 or greater"
          ),
          target_unit: Yup.string(),
          notes: Yup.string(),
          is_measured: Yup.boolean(),
        })
      )
      .min(1, "At least one measurable must be added"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      // Create the program first
      const programResponse = await apiCall(
        () =>
          programsApi.create({
            prog_nm: values.prog_nm,
          }),
        "Creating program"
      );

      // Add measurables to the program using batch API
      const validMeasurables = values.measurables.filter(
        (measurable) => measurable.meas_rk
      );
      if (validMeasurables.length > 0) {
        await apiCall(
          () =>
            measurablesApi.addMultipleToProgram(
              programResponse.prog_rk,
              validMeasurables
            ),
          "Adding measurables to program"
        );
      }

      alert("Program Created Successfully");
      refresh();

      // If onProgramCreated callback is provided, call it with the new program
      if (onProgramCreated) {
        onProgramCreated(programResponse);
      } else {
        close();
      }

      setSubmitting(false);
      return;
    } catch (error) {
      setErrors({ submit: error.message });
      Logger.error(error.message);
      return false;
    }
  };

  const addMeasurable = (setFieldValue, values) => {
    const newMeasurables = [
      ...values.measurables,
      {
        meas_rk: "",
        sort_order: values.measurables.length + 1,
        target_val: "",
        target_reps: "",
        target_sets: "",
        target_weight: "",
        target_unit: "",
        notes: "",
        is_measured: false,
      },
    ];
    setFieldValue("measurables", newMeasurables);
  };

  const removeMeasurable = (setFieldValue, values, index) => {
    const newMeasurables = values.measurables.filter((_, i) => i !== index);
    // Update sort orders
    newMeasurables.forEach((measurable, i) => {
      measurable.sort_order = i + 1;
    });
    setFieldValue("measurables", newMeasurables);
  };

  if (loading) {
    return <div>Loading measurables...</div>;
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
        {({ handleSubmit, isSubmitting, errors, values, setFieldValue }) => (
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

            <FieldOutputContainer>
              <FieldLabel>Program Measurables:</FieldLabel>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "15px",
                }}
              >
                Add measurables to this program. Each measurable can have
                specific targets and settings.
              </p>
            </FieldOutputContainer>

            {values.measurables.map((measurable, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <FieldLabel>Measurable {index + 1}</FieldLabel>
                  {values.measurables.length > 1 && (
                    <StyledButton
                      type="button"
                      onClick={() =>
                        removeMeasurable(setFieldValue, values, index)
                      }
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Remove
                    </StyledButton>
                  )}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <FieldLabel>Measurable:</FieldLabel>
                    <select
                      value={measurable.meas_rk}
                      onChange={(e) => {
                        const newMeasurables = [...values.measurables];
                        newMeasurables[index].meas_rk = e.target.value;

                        // Auto-fill unit from selected measurable
                        const selectedMeasurable = measurables.find(
                          (m) => m.meas_rk === parseInt(e.target.value)
                        );
                        if (selectedMeasurable) {
                          newMeasurables[index].target_unit =
                            selectedMeasurable.meas_unit || "";
                        }

                        setFieldValue("measurables", newMeasurables);
                      }}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="">Select a measurable</option>
                      {measurables.map((meas) => (
                        <option key={meas.meas_rk} value={meas.meas_rk}>
                          {meas.meas_id} ({meas.meas_typ})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FieldLabel>Sort Order:</FieldLabel>
                    <StyledInput
                      type="number"
                      min="1"
                      value={measurable.sort_order}
                      onChange={(e) => {
                        const newMeasurables = [...values.measurables];
                        newMeasurables[index].sort_order =
                          parseInt(e.target.value) || 1;
                        setFieldValue("measurables", newMeasurables);
                      }}
                    />
                  </div>

                  <div>
                    <FieldLabel>Target Value:</FieldLabel>
                    <StyledInput
                      type="number"
                      step="0.01"
                      min="0"
                      value={measurable.target_val}
                      onChange={(e) => {
                        const newMeasurables = [...values.measurables];
                        newMeasurables[index].target_val =
                          parseFloat(e.target.value) || "";
                        setFieldValue("measurables", newMeasurables);
                      }}
                      placeholder="e.g., 30 meters, 60 seconds"
                    />
                  </div>

                  <div>
                    <FieldLabel>Target Reps:</FieldLabel>
                    <StyledInput
                      type="number"
                      min="0"
                      value={measurable.target_reps}
                      onChange={(e) => {
                        const newMeasurables = [...values.measurables];
                        newMeasurables[index].target_reps =
                          parseInt(e.target.value) || "";
                        setFieldValue("measurables", newMeasurables);
                      }}
                      placeholder="Number of repetitions"
                    />
                  </div>

                  <div>
                    <FieldLabel>Target Sets:</FieldLabel>
                    <StyledInput
                      type="number"
                      min="0"
                      value={measurable.target_sets}
                      onChange={(e) => {
                        const newMeasurables = [...values.measurables];
                        newMeasurables[index].target_sets =
                          parseInt(e.target.value) || "";
                        setFieldValue("measurables", newMeasurables);
                      }}
                      placeholder="Number of sets"
                    />
                  </div>

                  <div>
                    <FieldLabel>Target Weight:</FieldLabel>
                    <StyledInput
                      type="number"
                      step="0.01"
                      min="0"
                      value={measurable.target_weight}
                      onChange={(e) => {
                        const newMeasurables = [...values.measurables];
                        newMeasurables[index].target_weight =
                          parseFloat(e.target.value) || "";
                        setFieldValue("measurables", newMeasurables);
                      }}
                      placeholder="Weight in kg/lbs"
                    />
                  </div>

                  <div>
                    <FieldLabel>Target Unit:</FieldLabel>
                    <StyledInput
                      type="text"
                      value={measurable.target_unit}
                      onChange={(e) => {
                        const newMeasurables = [...values.measurables];
                        newMeasurables[index].target_unit = e.target.value;
                        setFieldValue("measurables", newMeasurables);
                      }}
                      placeholder="e.g., kg, lbs, meters"
                    />
                  </div>

                  <div>
                    <FieldLabel>Notes:</FieldLabel>
                    <StyledInput
                      type="text"
                      value={measurable.notes}
                      onChange={(e) => {
                        const newMeasurables = [...values.measurables];
                        newMeasurables[index].notes = e.target.value;
                        setFieldValue("measurables", newMeasurables);
                      }}
                      placeholder="Optional notes"
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={measurable.is_measured}
                      onChange={(e) => {
                        const newMeasurables = [...values.measurables];
                        newMeasurables[index].is_measured = e.target.checked;
                        setFieldValue("measurables", newMeasurables);
                      }}
                    />
                    <FieldLabel style={{ margin: 0 }}>
                      Will be measured
                    </FieldLabel>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginBottom: "15px" }}>
              <StyledButton
                type="button"
                onClick={() => addMeasurable(setFieldValue, values)}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Add Another Measurable
              </StyledButton>
            </div>

            {errors.submit && <SubmitError>{errors.submit}</SubmitError>}
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <StyledButton type="submit" disabled={isSubmitting}>
                Save Program
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

export default AddProgramForm;
