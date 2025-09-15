import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import styled from "styled-components";
import logo from "../../images/LogoIcon.png";
import text from "../../images/LogoText.png";
import "typeface-nunito";
import useUserStore, {
  useUser,
  useIsCoach,
  useSelectedAthlete,
} from "../../stores/userStore";
import { personsApi } from "../../api";
import { useApi } from "../../hooks/useApi";

const Navbar = () => {
  const user = useUser();
  const isCoach = useIsCoach();
  const selectedAthlete = useSelectedAthlete();
  const { fetchUser, logout, setSelectedAthlete } = useUserStore();
  const { apiCall } = useApi();
  const [athletes, setAthletes] = useState([]);
  const [loadingAthletes, setLoadingAthletes] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const loadAthletes = async () => {
      if (isCoach) {
        setLoadingAthletes(true);
        try {
          const athletesData = await apiCall(
            () => personsApi.getAthletesForCoach(),
            "Loading athletes for navbar"
          );
          setAthletes(athletesData);
        } catch (error) {
          console.error("Error loading athletes for navbar:", error);
        } finally {
          setLoadingAthletes(false);
        }
      }
    };
    loadAthletes();
  }, [isCoach, apiCall]);

  const [profile, setProfile] = useState(false);

  return (
    <NavWrap>
      <NavLeft></NavLeft>
      <NavCenter>
        <Logo src={logo} />
        <Text src={text} />
      </NavCenter>
      <NavRight>
        {isCoach && (
          <AthleteSelectContainer>
            <AthleteSelect
              value={selectedAthlete || ""}
              onChange={(e) => setSelectedAthlete(e.target.value || null)}
              disabled={loadingAthletes}
            >
              <option value="">Select Athlete</option>
              {athletes.map((athlete) => (
                <option key={athlete.prsn_rk} value={athlete.prsn_rk}>
                  {athlete.prsn_first_nm} {athlete.prsn_last_nm}
                </option>
              ))}
            </AthleteSelect>
          </AthleteSelectContainer>
        )}
      </NavRight>
    </NavWrap>
  );
};

const NavWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  color: black;
  padding: 0;
  margin: 0;
  font-family: "Nunito", sans-serif;
  width: 100%;
  height: 55px;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid grey;
`;
const NavLeft = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const NavCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  a.active {
    color: #2b81e2;
    display: flex;
    text-decoration: none;
    font-family: "Nunito", sans-serif;
    font-weight: 700;
    border-bottom: 2px solid black;
    border-radius: 5px;
  }
`;

const NavRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 2%;
  flex: 1;
  gap: 15px;
`;

const AthleteSelectContainer = styled.div`
  display: flex;
  align-items: center;
`;

const AthleteSelect = styled.select`
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: "Nunito", sans-serif;
  background-color: white;
  min-width: 150px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #2b81e2;
    box-shadow: 0 0 0 2px rgba(43, 129, 226, 0.2);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const NavPath = styled(NavLink)`
  color: black;
  display: flex;
  margin: 35px;
  text-decoration: none;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  border-radius: 5px;
  font-size: 2.3vw;
  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
    font-weight: 800;
    color: #2b81e2;
    transition: 200ms;
  }
`;

const Logo = styled.img`
  display: flex;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  height: 50px;
  border-radius: 20px;
  padding-right: 5px;
  margin-left: 10px;
`;

const Text = styled.img`
  display: flex;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  width: 50%;
  border-radius: 20px;
`;

const Profile = styled.div`
  color: black;
  background-color: transparent;
  width: 50px;
  display: flex;
  flex-direction: column;
`;

const UserIcon = styled(FaIcons.FaUser)`
  height: 25px;
  width: 25px;
  &:hover {
    color: #2b81e2;
    transition: 200ms;
    cursor: pointer;
  }
`;
export default Navbar;
