import React, { useState, useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
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
import { programMeasurableAssignmentsApi, measurablesApi } from "../../api";
import { useApi } from "../../hooks/useApi";
import Logger from "../../utils/logger";

const AssignProgramForm = ({ close, refresh, program }) => {
  const [measurables, setMeasurables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const measurablesResponse = await apiCall(
          () => measurablesApi.getForAthletes(),
          "Fetching measurables for assignment"
        );
        setMeasurables(measurablesResponse);
      } catch (error) {
        Logger.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiCall]);

  const initialValues = {
    measurables: [
      {
        meas_rk: "",
        exas_reps: 0,
        exas_sets: 0,
        exas_weight: 0,
        exas_notes: "",
        is_measurable: false,
      },
    ],
  };

  const validationSchema = Yup.object().shape({
    measurables: Yup.array()
      .of(
        Yup.object().shape({
          meas_rk: Yup.number().required("Measurable is required"),
          exas_reps: Yup.number()
            .min(1, "Reps must be at least 1")
            .required("Reps is required"),
          exas_sets: Yup.number()
            .min(1, "Sets must be at least 1")
            .required("Sets is required"),
          exas_weight: Yup.number()
            .min(0, "Weight must be 0 or greater")
            .required("Weight is required"),
          exas_notes: Yup.string(),
          is_measurable: Yup.boolean(),
        })
      )
      .min(1, "At least one measurable must be added"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      // Add each measurable to the program
      for (const measurable of values.measurables) {
        if (measurable.meas_rk) {
          await apiCall(
            () =>
              programMeasurableAssignmentsApi.addToProgram(program.prog_rk, {
                meas_rk: measurable.meas_rk,
                sort_order: 1,
                target_reps: measurable.exas_reps,
                target_sets: measurable.exas_sets,
                target_weight: measurable.exas_weight,
                notes: measurable.exas_notes,
                is_measured: measurable.is_measurable,
              }),
            "Adding measurable to program"
          );
        }
      }
      alert("Measurables added to program successfully");
      refresh();
      close();
      setSubmitting(false);
      return;
    } catch (error) {
      setErrors({ submit: error.message });
      Logger.error(error.message);
      return false;
    }
  };

  if (loading) {
    return <div>Loading data...</div>;
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
            <FieldOutputContainer>
              <FieldLabel>Select Measurables to Assign:</FieldLabel>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "15px",
                }}
              >
                Select measurables from your athletes to assign to this program.
                Each measurable is already associated with a specific athlete.
              </p>
            </FieldOutputContainer>

            <FieldOutputContainer>
              <FieldLabel>Measurables:</FieldLabel>
              {values.measurables.map((measurable, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    margin: "10px 0",
                    borderRadius: "5px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <FieldLabel>Measurable:</FieldLabel>
                      <select
                        value={measurable.meas_rk}
                        onChange={(e) => {
                          const newMeasurables = [...values.measurables];
                          newMeasurables[index].meas_rk = e.target.value;
                          setFieldValue("measurables", newMeasurables);
                        }}
                        style={{
                          width: "100%",
                          padding: "5px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      >
                        <option value="">Select Measurable</option>
                        {measurables.map((meas) => (
                          <option key={meas.meas_rk} value={meas.meas_rk}>
                            {meas.prsn_first_nm} {meas.prsn_last_nm} -{" "}
                            {meas.meas_id} ({meas.meas_unit})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Reps:</FieldLabel>
                      <StyledInput
                        type="number"
                        value={measurable.exas_reps}
                        onChange={(e) => {
                          const newMeasurables = [...values.measurables];
                          newMeasurables[index].exas_reps =
                            parseInt(e.target.value) || 0;
                          setFieldValue("measurables", newMeasurables);
                        }}
                      />
                    </div>
                    <div>
                      <FieldLabel>Sets:</FieldLabel>
                      <StyledInput
                        type="number"
                        value={measurable.exas_sets}
                        onChange={(e) => {
                          const newMeasurables = [...values.measurables];
                          newMeasurables[index].exas_sets =
                            parseInt(e.target.value) || 0;
                          setFieldValue("measurables", newMeasurables);
                        }}
                      />
                    </div>
                    <div>
                      <FieldLabel>Weight:</FieldLabel>
                      <StyledInput
                        type="number"
                        value={measurable.exas_weight}
                        onChange={(e) => {
                          const newMeasurables = [...values.measurables];
                          newMeasurables[index].exas_weight =
                            parseFloat(e.target.value) || 0;
                          setFieldValue("measurables", newMeasurables);
                        }}
                      />
                    </div>
                    <div>
                      <FieldLabel>Notes:</FieldLabel>
                      <StyledInput
                        type="text"
                        value={measurable.exas_notes}
                        onChange={(e) => {
                          const newMeasurables = [...values.measurables];
                          newMeasurables[index].exas_notes = e.target.value;
                          setFieldValue("measurables", newMeasurables);
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={measurable.is_measurable}
                          onChange={(e) => {
                            const newMeasurables = [...values.measurables];
                            newMeasurables[index].is_measurable =
                              e.target.checked;
                            setFieldValue("measurables", newMeasurables);
                          }}
                        />
                        Measurable
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newMeasurables = values.measurables.filter(
                        (_, i) => i !== index
                      );
                      setFieldValue("measurables", newMeasurables);
                    }}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                  >
                    Remove Measurable
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newMeasurables = [
                    ...values.measurables,
                    {
                      meas_rk: "",
                      exas_reps: 0,
                      exas_sets: 0,
                      exas_weight: 0,
                      exas_notes: "",
                      is_measurable: false,
                    },
                  ];
                  setFieldValue("measurables", newMeasurables);
                }}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Add Measurable
              </button>
            </FieldOutputContainer>
            <ErrorMessage name="measurables" component={SubmitError} />

            {errors.submit && <SubmitError>{errors.submit}</SubmitError>}
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <StyledButton type="submit" disabled={isSubmitting}>
                Assign Program
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

export default AssignProgramForm;
