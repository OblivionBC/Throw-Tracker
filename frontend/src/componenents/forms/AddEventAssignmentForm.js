import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import {
  eventAssignmentsApi,
  personsApi,
  meetsApi,
  eventTypesApi,
} from "../../api";

const FormContainer = styled.div`
  padding: 20px;
  max-width: 600px;
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
  meet_rk: Yup.number().required("Meet is required"),
  prsn_rk: Yup.number().required("Athlete is required"),
  etyp_rk: Yup.number().required("Event type is required"),
  attempt_one: Yup.number().nullable(),
  attempt_two: Yup.number().nullable(),
  attempt_three: Yup.number().nullable(),
  attempt_four: Yup.number().nullable(),
  attempt_five: Yup.number().nullable(),
  attempt_six: Yup.number().nullable(),
  final_mark: Yup.number().nullable(),
  notes: Yup.string(),
});

const AddEventAssignmentForm = ({ onSuccess, onCancel }) => {
  const [meets, setMeets] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meetsData, athletesData, eventTypesData] = await Promise.all([
          meetsApi.getAll(),
          personsApi.getAllAthletes(),
          eventTypesApi.getAll(),
        ]);
        setMeets(meetsData);
        setAthletes(athletesData);
        setEventTypes(eventTypesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await eventAssignmentsApi.create(values);
      onSuccess();
    } catch (error) {
      console.error("Error creating event assignment:", error);
      setErrors({
        submit: error.message || "Failed to create event assignment",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <FormContainer>
      <h2>Add Event Assignment</h2>
      <Formik
        initialValues={{
          meet_rk: "",
          prsn_rk: "",
          etyp_rk: "",
          attempt_one: "",
          attempt_two: "",
          attempt_three: "",
          attempt_four: "",
          attempt_five: "",
          attempt_six: "",
          final_mark: "",
          notes: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <FormGroup>
              <Label htmlFor="meet_rk">Meet *</Label>
              <Select as="select" name="meet_rk" id="meet_rk">
                <option value="">Select a meet</option>
                {meets.map((meet) => (
                  <option key={meet.meet_rk} value={meet.meet_rk}>
                    {meet.meet_nm} -{" "}
                    {new Date(meet.meet_dt).toLocaleDateString()}
                  </option>
                ))}
              </Select>
              <ErrorMessage name="meet_rk" component={ErrorText} />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="prsn_rk">Athlete *</Label>
              <Select as="select" name="prsn_rk" id="prsn_rk">
                <option value="">Select an athlete</option>
                {athletes.map((athlete) => (
                  <option key={athlete.prsn_rk} value={athlete.prsn_rk}>
                    {athlete.prsn_first_nm} {athlete.prsn_last_nm}
                  </option>
                ))}
              </Select>
              <ErrorMessage name="prsn_rk" component={ErrorText} />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="etyp_rk">Event Type *</Label>
              <Select as="select" name="etyp_rk" id="etyp_rk">
                <option value="">Select an event type</option>
                {eventTypes.map((eventType) => (
                  <option key={eventType.etyp_rk} value={eventType.etyp_rk}>
                    {eventType.etyp_type_name} - {eventType.event_group_name}
                  </option>
                ))}
              </Select>
              <ErrorMessage name="etyp_rk" component={ErrorText} />
            </FormGroup>

            <FormGroup>
              <Label>Attempts</Label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div>
                  <Label htmlFor="attempt_one">Attempt 1</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="attempt_one"
                    id="attempt_one"
                  />
                </div>
                <div>
                  <Label htmlFor="attempt_two">Attempt 2</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="attempt_two"
                    id="attempt_two"
                  />
                </div>
                <div>
                  <Label htmlFor="attempt_three">Attempt 3</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="attempt_three"
                    id="attempt_three"
                  />
                </div>
                <div>
                  <Label htmlFor="attempt_four">Attempt 4</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="attempt_four"
                    id="attempt_four"
                  />
                </div>
                <div>
                  <Label htmlFor="attempt_five">Attempt 5</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="attempt_five"
                    id="attempt_five"
                  />
                </div>
                <div>
                  <Label htmlFor="attempt_six">Attempt 6</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="attempt_six"
                    id="attempt_six"
                  />
                </div>
              </div>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="final_mark">Final Mark</Label>
              <Input
                type="number"
                step="0.01"
                name="final_mark"
                id="final_mark"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="notes">Notes</Label>
              <TextArea
                as="textarea"
                name="notes"
                id="notes"
                placeholder="Additional notes..."
              />
            </FormGroup>

            {errors.submit && <ErrorText>{errors.submit}</ErrorText>}

            <div style={{ marginTop: "20px" }}>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Assignment"}
              </Button>
              <CancelButton type="button" onClick={onCancel}>
                Cancel
              </CancelButton>
            </div>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default AddEventAssignmentForm;
