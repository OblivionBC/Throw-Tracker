import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import logo from "../../images/LogoIcon.png";

// Mock Data
const MOCKUSER = {
  name: "John Doe",
  role: "Throws",
  organization: "UBC",
  profilePic: logo, // Replace with an actual image URL
};

const sidebarItems = [
  { name: "Dashboard", route: "/dashboard" },
  { name: "Projects", route: "/projects" },
  { name: "Teams", route: "/teams" },
  { name: "Settings", route: "/settings" },
];

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const profileRef = useRef(null);
  const { user, signOut } = useUser();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (profileRef.current) {
      const rect = profileRef.current.getBoundingClientRect();
      setModalPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setIsModalOpen(!isModalOpen);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSignOut = () => {
    alert("Signing out...");
    navigate("/login");
    signOut();
  };

  return (
    <SidebarContainer>
      {/* User Profile Section */}
      <ProfileTrigger ref={profileRef} onClick={handleProfileClick}>
        <ProfilePicture
          src={MOCKUSER.profilePic}
          alt={`${MOCKUSER.name}'s profile`} // Open modal on click
        />
      </ProfileTrigger>
      <UserName>{MOCKUSER.name}</UserName>
      <UserDetails>{MOCKUSER.role}</UserDetails>
      <UserDetails>{MOCKUSER.organization}</UserDetails>

      {sidebarItems.map((item, index) => (
        <NavItem key={index}>
          <StyledLink to={item.route}>{item.name}</StyledLink>
        </NavItem>
      ))}
      {isModalOpen && (
        <Modal top={modalPosition.top} left={modalPosition.left}>
          <List>
            <UserName>{MOCKUSER.name}</UserName>
            <UserDetails>{MOCKUSER.role}</UserDetails>
            <UserDetails>{MOCKUSER.organization}</UserDetails>
          </List>
          <SignOut onClick={() => handleSignOut()}>Sign Out</SignOut>
        </Modal>
      )}
    </SidebarContainer>
  );
};
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
const NavItem = styled.div`
  margin: 10px 0;
  width: 100%;
`;

const StyledLink = styled(Link)`
  text-decoration: underline;

  font-size: 16px;
  color: black;
  padding: 10px 15px;
  display: block;
  border-radius: 5px;
  border: solid 3px gray;

  &:hover {
    background-color: #4caf50;
    color: #black;
  }
`;
const List = styled.li`
  color: black;
  font-family: "Nunito", sans-serif;
  list-style-type: none;
  padding: 0;
  margin: 0;
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
const ProfileTrigger = styled.div`
  cursor: pointer;
  padding: 10px;
  background: white;
  border-radius: 5px;
  margin-bottom: 15px;
  &:hover {
    background: #e0e0e0;
  }
  text-align: center;
  margin-bottom: 40px;
`;

// Styled Components
const SidebarContainer = styled.div`
  width: 150px;
  height: 100vh;
  background-color: #fff;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const ProfilePicture = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 3px solid #4caf50;
  cursor: pointer; /* Make it clickable */
`;

const UserName = styled.h3`
  font-size: 18px;
  margin: 0;
  color: black;
`;

const UserDetails = styled.p`
  font-size: 14px;
  margin: 5px 0;
  color: gray;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 270px; /* Beside the sidebar */
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6); /* Dim the background */
  width: 300px;
  height: auto;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  color: #333;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  width: 90%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
`;

const ProfileInfo = styled.p`
  margin: 10px 0;
`;

const SignOutButton = styled.button`
  padding: 10px 20px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c9302c;
  }
`;

export default Sidebar;
