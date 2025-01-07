import React from "react";
import { useEffect, useState } from "react";
function checkMeasurable(row) {
  return row.meas_rk && row.is_measurable === "Y";
}
const ProgramSelectWithExercise = ({ trpe_rk, setData }) => {
  const [programData, setProgramData] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState(-1);
  const [disabled, setDisabled] = useState(true);
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
              if (newMap.has(element.prog_rk)) {
                newMap.get(element.prog_rk)?.push(element);
              } else {
                newMap.set(element.prog_rk, [element]);
              }
            });
            let defaultKey = newMap.entries().next().value[0];
            console.log(defaultKey);
            setProgramData(newMap);
            setSelectedValue(defaultKey);
            setDisabled(false);
            let data = newMap.get(Number(defaultKey))?.filter(checkMeasurable);
            setData(data);
          } else {
            setProgramData(new Map());
            setSelectedValue(-1);
            setData([]);
            setDisabled(true);
            console.log("ROW COUNT IS 0");
          }
          console.log(selectedValue);
        }
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };
    fetchProgramData();
  }, [trpe_rk]);

  if (loading) return <div>Loading...</div>;
  return (
    <>
      <select
        onChange={(event) => {
          let data = programData
            .get(Number(event.target.value))
            ?.filter(checkMeasurable);
          console.log(data);
          setData(data);
          setSelectedValue(Number(event.target.value));
        }}
        value={selectedValue}
        disabled={disabled}
      >
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
    </>
  );
};
export default ProgramSelectWithExercise;
