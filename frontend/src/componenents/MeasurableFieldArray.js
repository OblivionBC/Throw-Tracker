import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useUser } from "./contexts/UserContext";
import PersonMeasurableOptions from "./PersonMeasurableOptions";
import { v4 as uuidv4 } from "uuid";

// Here is an example of a form with an editable list.
// Next to each input are buttons for insert and remove.
// If the list is empty, there is a button to add an item.
export const MeasurableFieldArray = ({ array, values, prac_rk }) => {
  const { user } = useUser();
  console.log(user.prac_rk);
  return (
    <FieldArray name="measurables">
      {(fieldArrayProps) => {
        const { push, remove, form } = fieldArrayProps;
        const { values } = form;
        const { measurables } = values;
        console.log(values);
        return (
          <div>
            {measurables.length === 0 && (
              <>
                <span>Add Measurable</span>
                <button
                  type="button"
                  onClick={() =>
                    push({
                      meas_rk: -1,
                      msrm_value: 0,
                    })
                  }
                >
                  +
                </button>
              </>
            )}
            {measurables.map((measurable, index) => (
              <div key={index}>
                <PersonMeasurableOptions
                  name={`measurables[${index}].meas_rk`}
                  prsn_rk={user.prsn_rk}
                />
                <Field
                  name={`measurables[${index}].msrm_value`}
                  type="number"
                />
                <button type="button" onClick={() => remove({ index })}>
                  -
                </button>
                <button
                  type="button"
                  onClick={() =>
                    push({
                      meas_rk: -1,
                      msrm_value: 0,
                    })
                  }
                >
                  +
                </button>
              </div>
            ))}
          </div>
        );
      }}
    </FieldArray>
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
const Divy = styled.div`
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
