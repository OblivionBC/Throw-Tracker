import React from "react";
import { Field, FieldArray } from "formik";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import PersonMeasurableOptions from "./PersonMeasurableOptions";

// Here is an example of a form with an editable list.
// Next to each input are buttons for insert and remove.
// If the list is empty, there is a button to add an item.
export const MeasurableFieldArray = () => {
  const { user } = useUser();
  return (
    <FieldArray name="measurables">
      {(fieldArrayProps) => {
        const { push, remove, form } = fieldArrayProps;
        const { values } = form;
        const { measurables } = values;
        return (
          <div>
            {measurables.length === 0 && (
              <>
                <span>Add Measurable</span>
                <AddButton
                  type="button"
                  onClick={() =>
                    push({
                      meas_rk: -1,
                      msrm_value: 0,
                    })
                  }
                >
                  +
                </AddButton>
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
                <DeleteButton
                  type="button"
                  onClick={() => {
                    remove(index);
                    console.log(values.measurables);
                  }}
                >
                  -
                </DeleteButton>
                <AddButton
                  type="button"
                  onClick={() =>
                    push({
                      meas_rk: -1,
                      msrm_value: 0,
                    })
                  }
                >
                  +
                </AddButton>
              </div>
            ))}
          </div>
        );
      }}
    </FieldArray>
  );
};
const AddButton = styled.button`
  background: linear-gradient(45deg, #808080 30%, black 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 2px 6px;
  margin-left: 10px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;
const DeleteButton = styled.button`
  background: linear-gradient(45deg, black 30%, #808080 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 2px 6px;
  margin-left: 5px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;
