import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useUser } from "./UserContext";
import PersonMeasurableOptions from "./PersonMeasurableOptions";

// Here is an example of a form with an editable list.
// Next to each input are buttons for insert and remove.
// If the list is empty, there is a button to add an item.
export const MeasurableFieldArray = ({ array, values, prac_rk }) => {
  const [measurables, setMeasurables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchMeasurables = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api//get-all-measurablesForPrsn`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prsn_rk: user.prsn_rk,
            }),
          }
        );
        const jsonData = await response.json();
        setMeasurables(jsonData.rows);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };
    fetchMeasurables();
  }, []);

  return (
    <FieldArray
      name="measurables"
      render={(arrayHelpers) => (
        <Container>
          {array && array.length > 0 ? (
            array.map((array, index) => (
              <MeasurableContainer key={index}>
                <PersonMeasurableOptions
                  name={`measurables.${index}.meas_rk`}
                />
                <Field name={`measurables.${index}.msrm_value`}>
                  {({ field }) => (
                    <FieldOutputContainer>
                      <FieldLabel>Measurement:</FieldLabel>
                      <SmallInput {...field} />
                    </FieldOutputContainer>
                  )}
                </Field>
                <button
                  type="button"
                  onClick={() => {
                    arrayHelpers.remove(index);
                    console.log(arrayHelpers);
                    console.log(values.measurables);
                  }} // remove a friend from the list
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => {
                    arrayHelpers.insert(index, {
                      meas_rk: -1,
                      prac_rk: prac_rk,
                      msrm_value: 0,
                    });
                    console.log(values.measurables);
                  }} // insert an empty string at a position
                >
                  +
                </button>
              </MeasurableContainer>
            ))
          ) : (
            <button
              type="button"
              onClick={() => {
                arrayHelpers.push({
                  meas_rk: -1,
                  prac_rk: prac_rk,
                  msrm_value: 0,
                });
                console.log(values.measurables);
              }}
            >
              {/* show this when user has removed all friends from the list */}
              Add Measurable
            </button>
          )}
        </Container>
      )}
    />
  );
};

const Container = styled.div``;
const MeasurableContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 20px;
  border: 1px solid black;
  margin-top: 5px;
`;
const FieldOutputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 10px;
`;
const FieldLabel = styled.p`
  margin-right: 10px;
`;
const SmallInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 20%;
`;
