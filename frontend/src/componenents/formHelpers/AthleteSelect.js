import React from "react";
import { useEffect, useState } from "react";
import { personsApi } from "../../api";
import useUserStore, { useSelectedAthlete } from "../../stores/userStore";

const AthleteSelect = ({ org_name, updateUser }) => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedAthlete = useSelectedAthlete();
  const { setSelectedAthlete } = useUserStore();

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const data = await personsApi.getAthletesForCoach();
        setAthletes(data);
      } catch (error) {
        console.error("Error fetching athletes:", error);
      }
    };
    fetchAthletes();
  }, []);

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
