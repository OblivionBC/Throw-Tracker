import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import styled from "styled-components";
import logo from "../../images/LogoIcon.png";
import text from "../../images/LogoText.png";
import "typeface-nunito";
import AccountDetailsModal from "../modals/AccountDetailModal";
import AthleteSelect from "../formHelpers/AthleteSelect";
import { useUser } from "../contexts/UserContext";

const Navbar = () => {
  const [profile, setProfile] = useState(false);
  // Example of updating user data
  const { user } = useUser();
  return (
    <NavWrap>
      <NavLeft>
        <Profile onClick={() => setProfile(!profile)}>
          <UserIcon />
          <AccountDetailsModal on={profile} />
        </Profile>
        {user.prsn_role === "COACH" ? (
          <AthleteSelect prsn_rk={user.prsn_rk} org_name={user.org_name} />
        ) : null}
      </NavLeft>
      <NavCenter>
        <NavPath to="/home">Home</NavPath>
        <NavPath to="/practices">Practices</NavPath>
        <NavPath to="/meets">Meets</NavPath>
        {user.prsn_role === "COACH" ? (
          <NavPath to="/coach">Coach</NavPath>
        ) : null}
      </NavCenter>
      <NavRight>
        <Logo src={logo} />
        <Text src={text} />
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
  justify-content: space-between;
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
