import React, { useState, useEffect } from "react";
import { Formik } from "formik";
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
import { trainingPeriodsApi, programAthleteAssignmentsApi } from "../../api";
import { useApi } from "../../hooks/useApi";
import Logger from "../../utils/logger";

const AssignProgramToTrainingPeriodsForm = ({ close, refresh, program }) => {
  const [trainingPeriods, setTrainingPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all training periods for athletes coached by this user
        const periods = await apiCall(
          () => trainingPeriodsApi.getAll(),
          "Fetching training periods for assignment"
        );
        setTrainingPeriods(periods);
      } catch (error) {
        Logger.error("Error fetching training periods:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiCall]);

  const initialValues = {
    assignments: [
      {
        trpe_rk: "",
        notes: "",
      },
    ],
  };

  const validationSchema = Yup.object().shape({
    assignments: Yup.array()
      .of(
        Yup.object().shape({
          trpe_rk: Yup.number().required("Training period is required"),
          notes: Yup.string(),
        })
      )
      .min(1, "At least one training period must be selected"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      // Filter out empty assignments
      const validAssignments = values.assignments.filter(
        (assignment) => assignment.trpe_rk !== ""
      );

      if (validAssignments.length === 0) {
        setErrors({ submit: "At least one training period must be selected" });
        setSubmitting(false);
        return;
      }

      await apiCall(
        () =>
          programAthleteAssignmentsApi.assignToTrainingPeriods(
            program.prog_rk,
            validAssignments
          ),
        "Assigning program to training periods"
      );
      alert("Program Assigned Successfully");
      refresh();
      close();
      setSubmitting(false);
      return;
    } catch (error) {
      setErrors({ submit: error.message });
      Logger.error(error.message);
      setSubmitting(false);
      return false;
    }
  };

  const addAssignment = (setFieldValue, values) => {
    const newAssignments = [
      ...values.assignments,
      {
        trpe_rk: "",
        notes: "",
      },
    ];
    setFieldValue("assignments", newAssignments);
  };

  const removeAssignment = (setFieldValue, values, index) => {
    const newAssignments = values.assignments.filter((_, i) => i !== index);
    setFieldValue("assignments", newAssignments);
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
        {({ handleSubmit, isSubmitting, errors, values, setFieldValue }) => (
          <StyledForm onSubmit={handleSubmit}>
            <FieldOutputContainer>
              <FieldLabel>Assign Program to Training Periods:</FieldLabel>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "15px",
                }}
              >
                Select training periods to assign this program to. Each training
                period represents an athlete's training cycle.
              </p>
            </FieldOutputContainer>

            <FieldOutputContainer>
              <FieldLabel>Training Period Assignments:</FieldLabel>
              {values.assignments.map((assignment, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    margin: "10px 0",
                    borderRadius: "5px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                    }}
                  >
                    <div>
                      <FieldLabel>Training Period:</FieldLabel>
                      <select
                        value={assignment.trpe_rk}
                        onChange={(e) => {
                          const newAssignments = [...values.assignments];
                          newAssignments[index].trpe_rk = e.target.value;
                          setFieldValue("assignments", newAssignments);
                        }}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      >
                        <option value="">Select Training Period</option>
                        {trainingPeriods.map((period) => {
                          const athlete = period.athlete || {};
                          return (
                            <option key={period.trpe_rk} value={period.trpe_rk}>
                              {athlete.prsn_first_nm} {athlete.prsn_last_nm} -{" "}
                              {period.trpe_start_dt} to{" "}
                              {period.trpe_end_dt || "Ongoing"}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Notes (Optional):</FieldLabel>
                      <StyledInput
                        type="text"
                        value={assignment.notes}
                        onChange={(e) => {
                          const newAssignments = [...values.assignments];
                          newAssignments[index].notes = e.target.value;
                          setFieldValue("assignments", newAssignments);
                        }}
                        placeholder="Add notes for this assignment"
                      />
                    </div>
                  </div>
                  {values.assignments.length > 1 && (
                    <div style={{ marginTop: "10px" }}>
                      <StyledButton
                        type="button"
                        onClick={() =>
                          removeAssignment(setFieldValue, values, index)
                        }
                        style={{
                          backgroundColor: "#dc3545",
                          color: "white",
                          padding: "5px 10px",
                          fontSize: "12px",
                        }}
                      >
                        Remove Assignment
                      </StyledButton>
                    </div>
                  )}
                </div>
              ))}

              <div style={{ marginTop: "15px" }}>
                <StyledButton
                  type="button"
                  onClick={() => addAssignment(setFieldValue, values)}
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    padding: "8px 15px",
                    fontSize: "14px",
                  }}
                >
                  + Add Another Training Period
                </StyledButton>
              </div>
            </FieldOutputContainer>

            {errors.submit && <SubmitError>{errors.submit}</SubmitError>}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <StyledButton
                type="button"
                onClick={close}
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                }}
              >
                Cancel
              </StyledButton>
              <StyledButton
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                }}
              >
                {isSubmitting ? "Assigning..." : "Assign Program"}
              </StyledButton>
            </div>
          </StyledForm>
        )}
      </Formik>
    </>
  );
};

export default AssignProgramToTrainingPeriodsForm;
