import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import {
  athleteEventAssignmentsApi,
  personsApi,
  eventTypesApi,
} from "../../api";

const FormContainer = styled.div`
  padding: 20px;
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
  athlete_rk: Yup.number().required("Athlete is required"),
  etyp_rk: Yup.number().required("Event type is required"),
});

const AssignEventToAthleteForm = ({ onSuccess, onCancel, coachPrsnRk }) => {
  const [athletes, setAthletes] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [athletesData, eventTypesData] = await Promise.all([
          personsApi.getAllAthletes(),
          eventTypesApi.getAll(),
        ]);
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
      await athleteEventAssignmentsApi.assign(
        values.athlete_rk,
        values.etyp_rk
      );
      onSuccess();
    } catch (error) {
      console.error("Error assigning event to athlete:", error);
      setErrors({
        submit: error.message || "Failed to assign event to athlete",
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
      <h2>Assign Event to Athlete</h2>
      <Formik
        initialValues={{
          athlete_rk: "",
          etyp_rk: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <FormGroup>
              <Label htmlFor="athlete_rk">Athlete *</Label>
              <Select as="select" name="athlete_rk" id="athlete_rk">
                <option value="">Select an athlete</option>
                {athletes.map((athlete) => (
                  <option key={athlete.prsn_rk} value={athlete.prsn_rk}>
                    {athlete.prsn_first_nm} {athlete.prsn_last_nm}
                  </option>
                ))}
              </Select>
              <ErrorMessage name="athlete_rk" component={ErrorText} />
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

            {errors.submit && <ErrorText>{errors.submit}</ErrorText>}

            <div style={{ marginTop: "20px" }}>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Assigning..." : "Assign Event"}
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

export default AssignEventToAthleteForm;
