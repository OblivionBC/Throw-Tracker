import React from "react";
import styled from "styled-components";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { useEffect, useState } from "react";
import { useUser } from "./UserContext";

const PersonMeasurableOptions = ({ state, prsn_rk, name }) => {
  const [measurables, setMeasurables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchMeasurables = async () => {
      setLoading(true);
      try {
        const person = prsn_rk;
        const params = new URLSearchParams({
          key: JSON.stringify(person),
        });
        const response = await fetch(
          `http://localhost:5000/api//get-all-measurablesForPrsn?${params}`
        );
        const jsonData = await response.json();
        setMeasurables(jsonData.rows);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };
    fetchMeasurables();
  }, [state]);

  /*
  const MeasurableField = ({ name, remove }) => {
    return (
      <FieldOutputContainer>
        <FieldLabel>{name}</FieldLabel>
        <PersonMeasurableOptions name={name} prsn_rk={user.prsn_rk} />
        <button type="button" onClick={remove}>
          -
        </button>
      </FieldOutputContainer>
    );
  };

  <FieldArray name="measurables">
              {({ push, remove }) => (
                <div>
                  {values.measurables.map((measurable, index) => (
                    <div key={measurable.key}>
                      {measurable.component({
                        name: `measurables.${index}.value`,
                        remove: () => remove(index),
                      })}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      push({
                        name: `measurable${values.measurables.length}`,
                        key: values.measurables.length + 1,
                        component: () =>
                          MeasurableField(
                            `measurable${values.measurables.length}`,
                            (remove = () =>
                              remove(values.measurables.length + 1))
                          ),
                      })
                    }
                  >
                    +
                  </button>
                </div>
              )}
            </FieldArray>
*/
  if (loading) return loading;
  return (
    <Field as="select" name={name} placeholder="">
      {measurables?.map(({ meas_id }) => (
        <option key={meas_id} value={meas_id}>
          {meas_id}
        </option>
      ))}
    </Field>
  );
};

const FieldOutputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const FieldLabel = styled.h3`
  margin-right: 10px;
`;
export default PersonMeasurableOptions;
