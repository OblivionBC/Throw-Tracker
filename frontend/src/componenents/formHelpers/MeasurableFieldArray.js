import React from "react";
import { Field, FieldArray } from "formik";
import {
  AddButton,
  DeleteButton,
  StyledFieldArray,
} from "../../styles/styles.js";
import { useUser } from "../contexts/UserContext.js";
import PersonMeasurableOptions from "./PersonMeasurableOptions";

// Here is an example of a form with an editable list.
// Next to each input are buttons for insert and remove.
// If the list is empty, there is a button to add an item.
export const MeasurableFieldArray = () => {
  const { getUser } = useUser();
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
                  prsn_rk={getUser()}
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
