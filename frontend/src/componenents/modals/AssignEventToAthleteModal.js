import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { eventAssignmentsApi, personsApi, meetsApi } from "../../api";
import { useApi } from "../../hooks/useApi";
import {
  StyledButton,
  CloseButton,
  CancelButton,
} from "../../styles/design-system";

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

/* const Select = styled(Field)`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`; */

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

const validationSchema = Yup.object({
  prsn_rk: Yup.string().required("Athlete is required"),
  etyp_rk: Yup.string().required("Event type is required"),
  notes: Yup.string().optional(),
});

const AssignEventToAthleteModal = ({
  open,
  onClose,
  onSuccess,
  meet,
  selectedEvent,
}) => {
  const [athletes, setAthletes] = useState([]);
  const [meetEvents, setMeetEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [athletesData, meetEventsData] = await Promise.all([
        apiCall(
          () => personsApi.getAthletesForCoach(),
          "Fetching athletes for assignment"
        ),
        apiCall(
          () => meetsApi.getSchedule(meet.meet_rk),
          `Fetching meet schedule for ${meet.meet_rk}`
        ),
      ]);
      setAthletes(athletesData);
      setMeetEvents(meetEventsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Create event assignment in event_assignment table
      await apiCall(
        () =>
          eventAssignmentsApi.create({
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
          }),
        "Assigning event to athlete"
      );

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
          <CloseButton onClick={onClose}>Close</CloseButton>
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
        <CloseButton onClick={onClose}>Close</CloseButton>
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
                etyp_rk: selectedEvent ? selectedEvent.etyp_rk.toString() : "",
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
                    {meetEvents.length === 0 ? (
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: "#f8f9fa",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          color: "#666",
                          fontStyle: "italic",
                        }}
                      >
                        No events are currently scheduled for this meet. Please
                        add events to the meet first.
                      </div>
                    ) : (
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
                        {meetEvents.map((meetEvent) => (
                          <option
                            key={meetEvent.etyp_rk}
                            value={meetEvent.etyp_rk}
                          >
                            {meetEvent.etyp_type_name} -{" "}
                            {meetEvent.event_group_name} (
                            {meetEvent.scheduled_time})
                          </option>
                        ))}
                      </Field>
                    )}
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
                    <StyledButton
                      type="submit"
                      disabled={isSubmitting || meetEvents.length === 0}
                    >
                      {isSubmitting
                        ? "Assigning..."
                        : meetEvents.length === 0
                        ? "No Events Available"
                        : "Assign Athlete to Event"}
                    </StyledButton>
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
