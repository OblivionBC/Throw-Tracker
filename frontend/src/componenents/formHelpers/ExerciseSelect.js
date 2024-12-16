import React from "react";
import { Field } from "formik";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

const ExerciseSelect = ({ name }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api//get-exerciseForCoach`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              coach_prsn_rk: user.prsn_rk,
            }),
          }
        );
        const jsonData = await response.json();
        setExercises(jsonData.rows);
        console.log(jsonData.rows);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };
    fetchExercises();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <Field as="select" name={name} placeholder="">
      <option value="" label="Select option" />
      {exercises?.map(({ excr_nm, excr_rk }) => {
        return (
          <option key={excr_nm} value={excr_rk}>
            {excr_nm}
          </option>
        );
      })}
    </Field>
  );
};
export default ExerciseSelect;
