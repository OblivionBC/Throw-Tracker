import React from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import styled from "styled-components";
import logo from "../images/ThrowLogo.png";
import "typeface-nunito";

const NavWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 0;
  margin: 0;
  font-family: "Nunito", sans-serif;
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
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
`;

const NavPath = styled(Link)`
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

const Profile = styled(Link)`
  color: white;
  width: 50px;
  &:hover {
    color: #2b81e2;
    transition: 200ms;
  }
`;

const UserIcon = styled(FaIcons.FaUser)`
  height: 25px;
  width: 25px;
`;
const Navbar = () => {
  return (
    <NavWrap>
      <NavLeft>
        <Logo src={logo} />
      </NavLeft>
      <NavCenter>
        <NavPath to="/home">Home</NavPath>
        <NavPath to="/practices">Practices</NavPath>
        <NavPath to="/meets">Meets</NavPath>
      </NavCenter>
      <NavRight>
        <Profile to="/account">
          <UserIcon />
        </Profile>
      </NavRight>
    </NavWrap>
  );
};

export default Navbar;