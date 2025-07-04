import React from "react";
import { Field } from "formik";
import { useEffect, useState } from "react";
import { exercisesApi } from "../../api";

const ExerciseSelect = ({ name }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await exercisesApi.getForCoach();
        setExercises(response);
        console.log(response);
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
