import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
const AthleteSelect = ({ prsn_rk, org_name, updateUser }) => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedAthlete, getUser } = useUser();
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
  }, [prsn_rk]);

  if (loading) return <div>Loading...</div>;
  return (
    <select
      onChange={(choice) => {
        if (updateUser !== false) {
          setSelectedAthlete(choice.target.value);
        }
      }}
    >
      <option value="-1" label="Select Athlete" />
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
