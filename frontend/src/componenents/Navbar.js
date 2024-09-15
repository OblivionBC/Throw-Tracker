import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import styled from "styled-components";
import logo from "../images/ThrowLogo5.png";
import "typeface-nunito";
import AccountDetailsModal from "./modals/AccountDetailModal";

const NavWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 0;
  margin: 0;
  font-family: "Nunito", sans-serif;
  width: 100%;
  height: 55px;
`;
const NavLeft = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

const NavCenter = styled.div`
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  a.active {
    color: white;
    display: flex;
    margin: 35px;
    padding: 0;
    text-decoration: none;
    font-family: "Nunito", sans-serif;
    font-weight: 700;
    border-bottom: 2px solid white;
    border-radius: 5px;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
`;

const NavPath = styled(NavLink)`
  color: white;
  display: flex;
  margin: 35px;
  padding: 0;
  text-decoration: none;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
`;

const Logo = styled.img`
  display: flex;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  height: 70px;
  border-radius: 20px;
`;

const Profile = styled.div`
  color: white;
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
const Navbar = () => {
  const [profile, setProfile] = useState(false);
  // Example of updating user data

  return (
    <NavWrap>
      <NavLeft>
        <Logo src={logo} />
      </NavLeft>
      <NavCenter>
        <NavPath to="/">Home</NavPath>
        <NavPath to="/practices">Practices</NavPath>
        <NavPath to="/meets">Meets</NavPath>
      </NavCenter>
      <NavRight>
        <Profile onClick={() => setProfile(!profile)}>
          <UserIcon />
          <AccountDetailsModal on={profile} />
        </Profile>
      </NavRight>
    </NavWrap>
  );
};

export default Navbar;
