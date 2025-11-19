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
import {
  programAthleteAssignmentsApi,
  personsApi,
  trainingPeriodsApi,
} from "../../api";
import { useApi } from "../../hooks/useApi";
import Logger from "../../utils/logger";

const AssignProgramToAthletesForm = ({ close, refresh, program }) => {
  const [trainingPeriods, setTrainingPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const periodsResponse = await apiCall(
          () => trainingPeriodsApi.getAll(),
          "Fetching training periods for athlete assignment"
        );
        setTrainingPeriods(periodsResponse);
      } catch (error) {
        Logger.error("Error fetching data:", error);
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
        "Assigning program to athletes"
      );
      alert("Program Assigned Successfully");
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
              <FieldLabel>Assign Program to Training Periods:</FieldLabel>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "15px",
                }}
              >
                Select training periods to assign the program "
                {program?.prog_nm}" to. Each training period represents an
                athlete's training cycle.
              </p>
            </FieldOutputContainer>

            {values.assignments.map((assignment, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "4px",
                }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <FieldLabel>Training Period {index + 1}:</FieldLabel>
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
                      return (
                        <option key={period.trpe_rk} value={period.trpe_rk}>
                          {period.prsn_first_nm} {period.prsn_last_nm} -{" "}
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
            ))}

            <div style={{ marginBottom: "15px" }}>
              <StyledButton
                type="button"
                onClick={() => {
                  const newAssignments = [
                    ...values.assignments,
                    {
                      trpe_rk: "",
                      notes: "",
                    },
                  ];
                  setFieldValue("assignments", newAssignments);
                }}
              >
                Add Another Training Period
              </StyledButton>
            </div>

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

export default AssignProgramToAthletesForm;
