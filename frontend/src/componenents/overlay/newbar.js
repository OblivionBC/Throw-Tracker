import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useUser } from "../contexts/UserContext";

import "typeface-nunito";

// Styled Components
const Sidebar = styled.div`
  width: 250px;
  height: 100vh;
  background: #f5f5f5;
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
`;

const ProfileTrigger = styled.div`
  cursor: pointer;
  padding: 10px;
  background: white;
  border-radius: 5px;
  margin-bottom: 15px;
  &:hover {
    background: #e0e0e0;
  }
`;

const Modal = styled.div`
  background-color: white;
  border: 2px solid gray;
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  z-index: 2;
  padding: 5px;
  margin: 0;
  width: 200px;
  border-radius: 8px;
`;

const List = styled.li`
  color: black;
  font-family: "Nunito", sans-serif;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const Name = styled.ul`
  font-size: 20px;
  padding: 0;
  margin: 0;
  font-weight: bold;
`;

const Org = styled.ul`
  font-size: 18px;
  padding: 0;
  margin: 0;
  font-style: italic;
`;

const Role = styled.ul`
  font-size: 14px;
  padding: 0;
  margin: 0;
  font-style: italic;
`;

const SignOut = styled.button`
  background: linear-gradient(45deg, black 30%, #808080 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-top: 10px;
  width: 100%;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;

const SidebarWithProfile = () => {
  return (
    <Sidebar>
      <ProfileTrigger ref={profileRef} onClick={handleProfileClick}>
        {user.prsn_first_nm} {user.prsn_last_nm}
      </ProfileTrigger>

      {isModalOpen && (
        <Modal top={modalPosition.top} left={modalPosition.left}>
          <List>
            <Name>{user.prsn_first_nm + " " + user.prsn_last_nm}</Name>
            <Org>{user.org_name}</Org>
            <Role>{user.prsn_role}</Role>
          </List>
          <SignOut onClick={() => logout()}>Sign Out</SignOut>
        </Modal>
      )}
    </Sidebar>
  );
};

export default SidebarWithProfile;
