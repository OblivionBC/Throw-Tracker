import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { athleteEventAssignmentsApi, eventTypesApi } from "../../api";

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
  etyp_rk: Yup.string().required("Event type is required"),
});

const AssignEventToAthleteForm = ({
  onSuccess,
  onCancel,
  coachPrsnRk,
  selectedAthlete,
}) => {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventTypesData = await eventTypesApi.getAll();
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
        selectedAthlete.prsn_rk,
        parseInt(values.etyp_rk)
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
          etyp_rk: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, values }) => (
          <Form>
            <FormGroup>
              <Label>Athlete</Label>
              <div
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#f8f9fa",
                }}
              >
                {selectedAthlete?.prsn_first_nm} {selectedAthlete?.prsn_last_nm}
              </div>
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
                  <option key={eventType.etyp_rk} value={eventType.etyp_rk}>
                    {eventType.etyp_type_name} - {eventType.event_group_name}
                  </option>
                ))}
              </Field>
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
