import React from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import MeasurablesList from "../tables/MeasurementList";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import PersonMeasurableOptions from "../PersonMeasurableOptions";
const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem;
  height: auto;
  flex-direction: column;
`;

const PracticeEditForm = ({ prac, measurables, editing }) => {
  if (!editing) return null;

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 400);
  };

  return (
    <Content>
      <div>
        <h1>Any place in your app!</h1>
        <Formik
          initialValues={{ date: prac.prac_dt }}
          validate={(values) => {
            const errors = {};
            if (!values.date) {
              errors.date = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.date)
            ) {
              errors.date = "Invalid date";
            }
            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field type="date" name="date" />
              <ErrorMessage name="date" component="div" />
              <PersonMeasurableOptions state={editing} />

              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </Content>
  );
};

export default PracticeEditForm;
