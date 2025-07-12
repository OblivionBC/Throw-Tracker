import React from "react";
import { useEffect, useState } from "react";
import { programsApi, programMeasurableAssignmentsApi } from "../../api";

const ProgramSelectWithMeasurables = ({ trpe_rk, setData }) => {
  const [programData, setProgramData] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState(-1);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const fetchProgramData = async () => {
      setLoading(true);
      try {
        if (trpe_rk > 0) {
          // Get programs for this training period
          const programsResponse = await programsApi.getForTrainingPeriod(
            trpe_rk
          );
          console.log("Programs response:", programsResponse);

          let newMap = new Map();
          if (programsResponse.length > 0) {
            console.log("PROGRAMS FOUND");

            // For each program, get its measurables
            for (const program of programsResponse) {
              try {
                const measurablesResponse =
                  await programMeasurableAssignmentsApi.getProgramMeasurables(
                    program.prog_rk
                  );
                console.log(
                  `Measurables for program ${program.prog_rk}:`,
                  measurablesResponse
                );

                // Add program with its measurables to the map
                newMap.set(program.prog_rk, {
                  program: program,
                  measurables: measurablesResponse || [],
                });
              } catch (error) {
                console.error(
                  `Error fetching measurables for program ${program.prog_rk}:`,
                  error
                );
                // Add program with empty measurables array
                newMap.set(program.prog_rk, {
                  program: program,
                  measurables: [],
                });
              }
            }

            let defaultKey = newMap.entries().next().value[0];
            console.log("Default key:", defaultKey);
            setProgramData(newMap);
            setSelectedValue(defaultKey);
            setDisabled(false);

            // Set initial data (measurables for the first program)
            const defaultProgram = newMap.get(Number(defaultKey));
            setData(defaultProgram?.measurables || []);
          } else {
            setProgramData(new Map());
            setSelectedValue(-1);
            setData([]);
            setDisabled(true);
            console.log("NO PROGRAMS FOUND");
          }
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
        setProgramData(new Map());
        setSelectedValue(-1);
        setData([]);
        setDisabled(true);
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
          const selectedProgramKey = Number(event.target.value);
          const selectedProgram = programData.get(selectedProgramKey);
          console.log("Selected program data:", selectedProgram);
          setData(selectedProgram?.measurables || []);
          setSelectedValue(selectedProgramKey);
        }}
        value={selectedValue}
        disabled={disabled}
      >
        {programData.size === 0 ? (
          <option value={-1}>
            No Programs assigned for this Training Period
          </option>
        ) : (
          Array.from(programData.keys())?.map((key) => {
            const programInfo = programData.get(key);
            return (
              <option key={key} value={key}>
                {programInfo.program.prog_nm} ({programInfo.measurables.length}{" "}
                measurables)
              </option>
            );
          })
        )}
      </select>
    </>
  );
};

export default ProgramSelectWithMeasurables;
