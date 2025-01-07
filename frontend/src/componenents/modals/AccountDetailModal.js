import React from "react";
import styled from "styled-components";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import "typeface-nunito";

const Modal = styled.div`
  background-color: white;
  border: 2px solid gray;
  position: absolute;
  top: 4rem;
  right: 1.2rem;
  z-index: 2;
  padding: 5px;
  margin: 0;
  width: 10%;
  border-radius: 8px;
`;
const List = styled.li`
  color: black;
  font-family: "Nunito", sans-serif;
  list-style-type: none; /* Remove bullets */
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
`;
const Name = styled.ul`
  font-size: 20px;
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
  font-weight: bold;
`;
const Org = styled.ul`
  font-size: 18px;
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
  font-style: italic;
`;
const Role = styled.ul`
  font-size: 14px;
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
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

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;

const AccountDetailsModal = ({ on }) => {
  const { user, signOut } = useUser();
  const navigate = useNavigate();

  async function logout() {
    try {
      navigate("/login");
      signOut();
    } catch (error) {}
  }

  if (!on) {
    return null;
  }
  return (
    <Modal>
      <List>
        <Name>{user.prsn_first_nm + " " + user.prsn_last_nm}</Name>
        <Org>{user.org_name}</Org>
        <Role>{user.prsn_role}</Role>
      </List>
      <SignOut onClick={() => logout()}>Sign Out</SignOut>
    </Modal>
  );
};

export default AccountDetailsModal;
