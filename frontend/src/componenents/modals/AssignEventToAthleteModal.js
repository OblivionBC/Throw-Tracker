import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { eventAssignmentsApi, eventTypesApi, personsApi } from "../../api";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  z-index: 1;

  &:hover {
    color: #333;
  }
`;

const Content = styled.div`
  padding: 20px;
`;

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Select = styled(Field)`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const TextArea = styled(Field)`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #545b62;
  }
`;

const validationSchema = Yup.object({
  prsn_rk: Yup.string().required("Athlete is required"),
  etyp_rk: Yup.string().required("Event type is required"),
  notes: Yup.string().optional(),
});

const AssignEventToAthleteModal = ({ open, onClose, onSuccess, meet }) => {
  const [athletes, setAthletes] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [athletesData, eventTypesData] = await Promise.all([
        personsApi.getAthletesForCoach(),
        eventTypesApi.getAll(),
      ]);
      setAthletes(athletesData);
      setEventTypes(eventTypesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Create event assignment in event_assignment table
      await eventAssignmentsApi.create({
        meet_rk: meet.meet_rk,
        prsn_rk: parseInt(values.prsn_rk),
        etyp_rk: parseInt(values.etyp_rk),
        notes: values.notes || null,
        // Set attempt fields to null initially
        attempt_one: null,
        attempt_two: null,
        attempt_three: null,
        attempt_four: null,
        attempt_five: null,
        attempt_six: null,
        final_mark: null,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error assigning event to athlete:", error);
      setErrors({
        submit: error.message || "Failed to assign event to athlete",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  if (loading) {
    return (
      <Overlay>
        <ModalContainer>
          <CloseButton onClick={onClose}>×</CloseButton>
          <Content>
            <div>Loading...</div>
          </Content>
        </ModalContainer>
      </Overlay>
    );
  }

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Content>
          <FormContainer>
            <h2>Assign Athlete to Event</h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Assign an athlete to an event for:{" "}
              <strong>{meet?.meet_nm}</strong>
            </p>

            <Formik
              initialValues={{
                prsn_rk: "",
                etyp_rk: "",
                notes: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, values }) => (
                <Form>
                  <FormGroup>
                    <Label htmlFor="prsn_rk">Athlete *</Label>
                    <Field
                      as="select"
                      name="prsn_rk"
                      id="prsn_rk"
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    >
                      <option value="">Select an athlete</option>
                      {athletes.map((athlete) => (
                        <option key={athlete.prsn_rk} value={athlete.prsn_rk}>
                          {athlete.prsn_first_nm} {athlete.prsn_last_nm}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="prsn_rk" component={ErrorText} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="etyp_rk">Event Type *</Label>
                    <Field
                      as="select"
                      name="etyp_rk"
                      id="etyp_rk"
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    >
                      <option value="">Select an event type</option>
                      {eventTypes.map((eventType) => (
                        <option
                          key={eventType.etyp_rk}
                          value={eventType.etyp_rk}
                        >
                          {eventType.etyp_type_name} -{" "}
                          {eventType.event_group_name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="etyp_rk" component={ErrorText} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <TextArea
                      as="textarea"
                      name="notes"
                      id="notes"
                      placeholder="Add any notes about this assignment..."
                    />
                    <ErrorMessage name="notes" component={ErrorText} />
                  </FormGroup>

                  {errors.submit && <ErrorText>{errors.submit}</ErrorText>}

                  <div style={{ marginTop: "20px" }}>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? "Assigning..."
                        : "Assign Athlete to Event"}
                    </Button>
                    <CancelButton type="button" onClick={onClose}>
                      Cancel
                    </CancelButton>
                  </div>
                </Form>
              )}
            </Formik>
          </FormContainer>
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default AssignEventToAthleteModal;
