import React from "react";
import styled from "styled-components";
import { useUser } from "../UserContext";
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

const SignOut = styled.button``;

const AccountDetailsModal = ({ on }) => {
  const { user } = useUser();

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
      <SignOut>Sign Out</SignOut>
    </Modal>
  );
};

export default AccountDetailsModal;
