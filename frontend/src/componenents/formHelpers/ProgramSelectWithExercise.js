import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
const ProgramSelectWithExercise = ({ trpe_rk }) => {
  const [programData, setProgramData] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedProgramData, setSelectedProgramData] = useState([]);
  useEffect(() => {
    const fetchProgramData = async () => {
      setLoading(true);
      try {
        if (trpe_rk > 0) {
          const response = await fetch(
            `http://localhost:5000/api/get-programsAndExerciseForTRPE`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                trpe_rk: trpe_rk,
              }),
            }
          );
          console.log(response);
          const jsonData = await response.json();
          console.log(jsonData);
          let newMap = new Map();
          if (jsonData.rowCount > 0) {
            console.log("ROW COUNT IS GREAT");
            jsonData.rows.forEach((element) => {
              console.log(element);
              if (newMap.has(element.prog_rk)) {
                newMap.get(element.prog_rk)?.push(element);
              } else {
                newMap.set(element.prog_rk, [element]);
              }
            });
            setProgramData(newMap);
          } else {
            console.log("ROW COUNT IS 0");
          }
        }
      } catch (error) {
        console.error(error.message);
      }
      console.log(programData.size);
      setLoading(false);
    };
    fetchProgramData();
  }, [trpe_rk]);

  if (loading) return <div>Loading...</div>;
  return (
    <select
      onChange={(event) => {
        setSelectedProgramData(programData.get(event.target.value));
        console.log("CHOSE THIS ROW KEY " + event.target.value);
        console.log(event.target.value);
        console.log(programData.get(Number(event.target.value)));
      }}
    >
      <option value="-1" label="Select Athlete" />
      {programData.size === 0 ? (
        <option value={-1}>No Programs assigned for this TRPE</option>
      ) : (
        Array.from(programData.keys())?.map((key) => (
          <option key={key} value={key}>
            {key} : {programData.get(key)[0].prog_nm}
          </option>
        ))
      )}
    </select>
  );
};
export default ProgramSelectWithExercise;
