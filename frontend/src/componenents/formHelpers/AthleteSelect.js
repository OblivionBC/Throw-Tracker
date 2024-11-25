import React from "react";
import { useEffect, useState } from "react";
import { setSelectedAthlete } from "../contexts/UserContext";
const AthleteSelect = ({ prsn_rk, org_name }) => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAthletes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/athletes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coach_prsn_rk: prsn_rk,
            org_name: org_name,
          }),
        });
        const jsonData = await response.json();
        setAthletes(jsonData.rows);
        console.log("ATHLETES");
        console.log(jsonData.rows);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };
    fetchAthletes();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <select>
      <option
        value="-1"
        label="Select Athlete"
        onChange={() => {
          setSelectedAthlete(this.value);
          console.log("SELECTED ATHLETE");
          console.log(this.value);
        }}
      />
      {athletes?.map((props) => {
        return (
          <option key={props.prsn_rk} value={props.prsn_rk}>
            {props.prsn_first_nm + " " + props.prsn_last_nm}
          </option>
        );
      })}
    </select>
  );
};
export default AthleteSelect;
