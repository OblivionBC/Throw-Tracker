import React from "react";
import { useEffect, useState } from "react";
import { personsApi } from "../../api";
import useUserStore, {
  useSelectedAthlete,
  useUser,
} from "../../stores/userStore";
import { useApi } from "../../hooks/useApi";

const AthleteSelect = ({ org_name, updateUser }) => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedAthlete = useSelectedAthlete();
  const { setSelectedAthlete } = useUserStore();
  const user = useUser();
  const { apiCall } = useApi();
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const data = await apiCall(
          () => personsApi.getAthletesForCoach(),
          "Fetching athletes for select"
        );
        setAthletes(data);
      } catch (error) {
        Logger.error("Error fetching athletes:", error);
      }
    };
    fetchAthletes();
  }, [apiCall]);
  if (user?.role !== "COACH") {
    return null;
  }

  if (loading)
    return (
      <div style={{ color: "#1976d2", fontSize: "12px" }}>
        Loading athletes...
      </div>
    );

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid rgba(25, 118, 210, 0.2)",
        margin: "10px 0",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#1976d2",
          marginBottom: "5px",
          fontWeight: "bold",
        }}
      >
        Select Athlete:
      </div>
      <select
        style={{
          width: "100%",
          padding: "5px",
          borderRadius: "4px",
          border: "1px solid rgba(25, 118, 210, 0.3)",
          fontSize: "12px",
          color: "#1976d2",
        }}
        onChange={(choice) => {
          if (updateUser !== false) {
            setSelectedAthlete(choice.target.value);
          }
        }}
      >
        <option value="-1">Select Athlete</option>
        {athletes?.map((props) => {
          return (
            <option key={props.prsn_rk} value={props.prsn_rk}>
              {props.prsn_first_nm + " " + props.prsn_last_nm}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default AthleteSelect;
