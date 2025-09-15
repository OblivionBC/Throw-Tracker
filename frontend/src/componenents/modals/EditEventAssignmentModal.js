import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { eventAssignmentsApi } from "../../api";
import {
  StyledButton,
  CloseButton,
  CancelButton,
  DeleteButton,
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

const Input = styled(Field)`
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

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const InfoLabel = styled.span`
  font-weight: bold;
  color: #666;
`;

const InfoValue = styled.span`
  color: #333;
`;

const validationSchema = Yup.object({
  attempt_one: Yup.number().nullable(),
  attempt_two: Yup.number().nullable(),
  attempt_three: Yup.number().nullable(),
  attempt_four: Yup.number().nullable(),
  attempt_five: Yup.number().nullable(),
  attempt_six: Yup.number().nullable(),
  final_mark: Yup.number().nullable(),
  notes: Yup.string().optional(),
});

const EditEventAssignmentModal = ({
  open,
  onClose,
  onSuccess,
  assignment,
  meet,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!open || !assignment) return null;

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Convert empty strings to null for numeric fields
      const cleanedValues = {
        ...values,
        attempt_one:
          values.attempt_one === "" ? null : parseFloat(values.attempt_one),
        attempt_two:
          values.attempt_two === "" ? null : parseFloat(values.attempt_two),
        attempt_three:
          values.attempt_three === "" ? null : parseFloat(values.attempt_three),
        attempt_four:
          values.attempt_four === "" ? null : parseFloat(values.attempt_four),
        attempt_five:
          values.attempt_five === "" ? null : parseFloat(values.attempt_five),
        attempt_six:
          values.attempt_six === "" ? null : parseFloat(values.attempt_six),
        final_mark:
          values.final_mark === "" ? null : parseFloat(values.final_mark),
      };

      await eventAssignmentsApi.update(
        assignment.meet_rk,
        assignment.prsn_rk,
        assignment.etyp_rk,
        cleanedValues
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating event assignment:", error);
      setErrors({
        submit: error.message || "Failed to update event assignment",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await eventAssignmentsApi.delete(
        assignment.meet_rk,
        assignment.prsn_rk,
        assignment.etyp_rk
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting event assignment:", error);
      alert("Failed to delete assignment: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const initialValues = {
    attempt_one: assignment.attempt_one || "",
    attempt_two: assignment.attempt_two || "",
    attempt_three: assignment.attempt_three || "",
    attempt_four: assignment.attempt_four || "",
    attempt_five: assignment.attempt_five || "",
    attempt_six: assignment.attempt_six || "",
    final_mark: assignment.final_mark || "",
    notes: assignment.notes || "",
  };

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>Close</CloseButton>
        <Content>
          <FormContainer>
            <h2>Edit Event Assignment</h2>

            <InfoRow>
              <InfoLabel>Athlete:</InfoLabel>
              <InfoValue>
                {assignment.athlete_first_nm} {assignment.athlete_last_nm}
              </InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Event:</InfoLabel>
              <InfoValue>{assignment.event_name}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Meet:</InfoLabel>
              <InfoValue>{meet?.meet_nm}</InfoValue>
            </InfoRow>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, values }) => (
                <Form>
                  <FormGroup>
                    <Label htmlFor="attempt_one">Attempt 1</Label>
                    <Input
                      type="number"
                      step="0.01"
                      name="attempt_one"
                      id="attempt_one"
                      placeholder="Enter distance/mark"
                    />
                    <ErrorMessage name="attempt_one" component={ErrorText} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="attempt_two">Attempt 2</Label>
                    <Input
                      type="number"
                      step="0.01"
                      name="attempt_two"
                      id="attempt_two"
                      placeholder="Enter distance/mark"
                    />
                    <ErrorMessage name="attempt_two" component={ErrorText} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="attempt_three">Attempt 3</Label>
                    <Input
                      type="number"
                      step="0.01"
                      name="attempt_three"
                      id="attempt_three"
                      placeholder="Enter distance/mark"
                    />
                    <ErrorMessage name="attempt_three" component={ErrorText} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="attempt_four">Attempt 4</Label>
                    <Input
                      type="number"
                      step="0.01"
                      name="attempt_four"
                      id="attempt_four"
                      placeholder="Enter distance/mark"
                    />
                    <ErrorMessage name="attempt_four" component={ErrorText} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="attempt_five">Attempt 5</Label>
                    <Input
                      type="number"
                      step="0.01"
                      name="attempt_five"
                      id="attempt_five"
                      placeholder="Enter distance/mark"
                    />
                    <ErrorMessage name="attempt_five" component={ErrorText} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="attempt_six">Attempt 6</Label>
                    <Input
                      type="number"
                      step="0.01"
                      name="attempt_six"
                      id="attempt_six"
                      placeholder="Enter distance/mark"
                    />
                    <ErrorMessage name="attempt_six" component={ErrorText} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="final_mark">Final Mark</Label>
                    <Input
                      type="number"
                      step="0.01"
                      name="final_mark"
                      id="final_mark"
                      placeholder="Enter final mark"
                    />
                    <ErrorMessage name="final_mark" component={ErrorText} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="notes">Notes</Label>
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
                    <StyledButton type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update Assignment"}
                    </StyledButton>
                    <CancelButton type="button" onClick={onClose}>
                      Cancel
                    </CancelButton>
                    <DeleteButton
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete Assignment"}
                    </DeleteButton>
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

export default EditEventAssignmentModal;
