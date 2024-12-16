import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useUser } from "../contexts/UserContext";
import "typeface-nunito";
const AddProgram = async (props) => {
  const response = await fetch(`http://localhost:5000/api/add-program`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prog_nm: props.prog_nm,
      coach_prsn_rk: props.coach_prsn_rk,
      trpe_rk: props.trpe_rk,
    }),
  });
  console.log(response);
  const jsonData = await response.json();
  console.log(jsonData);
  if (response.ok === false) {
    console.log("Error?");
    console.log("ERROR HAS OCCURRED ", response.statusText);
  }
  return jsonData.rows[0].prac_rk;
};

const AddProgramForm = ({ close, refresh, props }) => {
  console.log(props);
  const { user } = useUser();
  const initialValues = {
    prog_nm: undefined,
    coach_prsn_rk: user.prsn_rk,
    trpe_rk: props.trpe_rk,
  };

  const validationSchema = Yup.object().shape({
    prog_nm: Yup.string().required(),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    console.log(values);
    try {
      const exas = AddProgram({
        prog_nm: values.prog_nm,
        coach_prsn_rk: values.coach_prsn_rk,
        trpe_rk: values.trpe_rk,
      });
      console.log(exas);
      alert("Prgoram Added Successfully");
      refresh();
      close();
      setSubmitting(false);
      return;
    } catch (error) {
      setErrors({ submit: error.message });
      console.error(error.message);
      return false;
    }
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, errors }) => (
          <StyledForm onSubmit={handleSubmit}>
            <FieldLabel>
              Training Period #{initialValues.coach_prsn_rk}
            </FieldLabel>
            <Field name="prog_nm" type="text">
              {({ field }) => (
                <FieldOutputContainer>
                  <FieldLabel>Program Name:</FieldLabel>
                  <StyledInput type="text" name="prog_nm" {...field} />
                </FieldOutputContainer>
              )}
            </Field>
            <ErrorMessage name="prog_nm" component={SubmitError} />

            {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
            <StyledButton type="submit" disabled={isSubmitting}>
              Save
            </StyledButton>
          </StyledForm>
        )}
      </Formik>
    </>
  );
};

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const StyledButton = styled.button`
  background: linear-gradient(45deg, darkblue 30%, skyblue 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 10px;
  margin-top: 10px;
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
const SubmitError = styled.div`
  font-size: 18;
  color: red;
  font-family: "Nunito", sans-serif;
`;

const FieldOutputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const FieldLabel = styled.h3`
  margin-right: 10px;
`;
export default AddProgramForm;
