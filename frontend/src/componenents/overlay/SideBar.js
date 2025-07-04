import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import styled from "styled-components";
import logo from "../../images/LogoIcon.png";
import useUserStore, { useUser, useIsCoach } from "../../stores/userStore";

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [practicesOpen, setPracticesOpen] = useState(false);
  const [meetsOpen, setMeetsOpen] = useState(false);
  const profileRef = useRef(null);
  const user = useUser();
  const isCoach = useIsCoach();
  const { logout: logoutUser } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Always call hooks at the top level
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide sidebar on login or root
  if (location.pathname === "/login" || location.pathname === "/") {
    return null;
  }

  // Profile modal logic
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
  const handleSignOut = () => {
    navigate("/login");
    logoutUser();
  };

  // Dropdown toggles
  const togglePractices = () => setPracticesOpen((open) => !open);
  const toggleMeets = () => setMeetsOpen((open) => !open);

  return (
    <SidebarContainer>
      {/* User Profile Section */}
      <ProfileTrigger ref={profileRef} onClick={handleProfileClick}>
        <ProfilePicture
          src={logo}
          alt={user ? `${user.first_nm} ${user.last_nm}` : "Profile"}
        />
      </ProfileTrigger>
      <UserName>{user ? `${user.first_nm} ${user.last_nm}` : "User"}</UserName>
      <UserDetails>{user?.role}</UserDetails>
      <UserDetails>{user?.org_name}</UserDetails>

      <NavSection>
        <NavItem>
          <StyledNavLink to="/home">
            <NavIcon>🏠</NavIcon>
            Home
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <DropdownButton onClick={togglePractices} $open={practicesOpen}>
            <ArrowIcon $open={practicesOpen}>▼</ArrowIcon>
            <NavIcon>🏃</NavIcon>
            Practices
          </DropdownButton>
          {practicesOpen && (
            <DropdownMenu>
              <DropdownItem>
                <StyledNavLink to="/measurables">
                  <SubNavIcon>📊</SubNavIcon>
                  Measurables
                </StyledNavLink>
              </DropdownItem>
              <DropdownItem>
                <StyledNavLink to="/training-periods">
                  <SubNavIcon>📅</SubNavIcon>
                  Training Periods
                </StyledNavLink>
              </DropdownItem>
              <DropdownItem>
                <StyledNavLink to="/practices">
                  <SubNavIcon>📋</SubNavIcon>
                  Practice List
                </StyledNavLink>
              </DropdownItem>
              <DropdownItem>
                <StyledNavLink to="/practice-charts">
                  <SubNavIcon>📈</SubNavIcon>
                  Chart
                </StyledNavLink>
              </DropdownItem>
            </DropdownMenu>
          )}
        </NavItem>
        <NavItem>
          <DropdownButton onClick={toggleMeets} $open={meetsOpen}>
            <ArrowIcon $open={meetsOpen}>▼</ArrowIcon>
            <NavIcon>🏆</NavIcon>
            Meets
          </DropdownButton>
          {meetsOpen && (
            <DropdownMenu>
              <DropdownItem>
                <StyledNavLink to="/meet-charts">
                  <SubNavIcon>📈</SubNavIcon>
                  Chart
                </StyledNavLink>
              </DropdownItem>
              <DropdownItem>
                <StyledNavLink to="/meets">
                  <SubNavIcon>🏅</SubNavIcon>
                  All Meets
                </StyledNavLink>
              </DropdownItem>
              <DropdownItem>
                <StyledNavLink to="/meet-calendar">
                  <SubNavIcon>📅</SubNavIcon>
                  Calendar
                </StyledNavLink>
              </DropdownItem>
            </DropdownMenu>
          )}
        </NavItem>
        {isCoach && (
          <NavItem>
            <StyledNavLink to="/coach">
              <NavIcon>👨‍💼</NavIcon>
              Coach
            </StyledNavLink>
          </NavItem>
        )}
      </NavSection>

      {isModalOpen && (
        <Modal top={modalPosition.top} left={modalPosition.left}>
          <List>
            <UserName>
              {user ? `${user.first_nm} ${user.last_nm}` : "User"}
            </UserName>
            <UserDetails>{user?.role}</UserDetails>
            <UserDetails>{user?.org_name}</UserDetails>
          </List>
          <SignOut onClick={handleSignOut}>Sign Out</SignOut>
        </Modal>
      )}
    </SidebarContainer>
  );
};

// Styled Components
const SidebarContainer = styled.div`
  width: 220px;
  height: 100vh;
  background: linear-gradient(180deg, #fafbfc 0%, #f5f7fa 100%);
  color: #1976d2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`;

const NavSection = styled.div`
  width: 100%;
  margin-top: 30px;
  padding: 0 15px;
`;

const NavItem = styled.div`
  margin: 5px 0;
  width: 100%;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  font-size: 16px;
  color: #1976d2;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  margin-bottom: 2px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(25, 118, 210, 0.2);

  &.active {
    background: rgba(25, 118, 210, 0.15);
    color: #1976d2;
    font-weight: bold;
    border: 1px solid rgba(25, 118, 210, 0.4);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:hover {
    background: rgba(25, 118, 210, 0.1);
    color: #1976d2;
    transform: translateX(3px);
  }
`;

const DropdownButton = styled.button`
  width: 100%;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(25, 118, 210, 0.2);
  border-radius: 8px;
  font-size: 16px;
  color: #1976d2;
  padding: 12px 15px;
  text-align: left;
  cursor: pointer;
  margin-bottom: 2px;
  outline: none;
  font-family: inherit;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(25, 118, 210, 0.1);
    transform: translateX(3px);
  }
`;

const ArrowIcon = styled.span`
  font-size: 12px;
  margin-right: 8px;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.$open ? "rotate(180deg)" : "rotate(0deg)")};
`;

const NavIcon = styled.span`
  font-size: 18px;
  margin-right: 10px;
`;

const SubNavIcon = styled.span`
  font-size: 14px;
  margin-right: 8px;
  opacity: 0.8;
`;

const DropdownMenu = styled.div`
  background: rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  margin: 5px 0 5px 15px;
  border: 1px solid rgba(25, 118, 210, 0.2);
  overflow: hidden;
  animation: slideDown 0.3s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DropdownItem = styled.div`
  width: 100%;

  ${StyledNavLink} {
    background: transparent;
    border: none;
    margin: 0;
    padding: 8px 15px;
    font-size: 14px;
    border-radius: 0;

    &:hover {
      background: rgba(25, 118, 210, 0.1);
      transform: translateX(2px);
    }

    &.active {
      background: rgba(25, 118, 210, 0.15);
      border-left: 3px solid #4caf50;
    }
  }
`;

const ProfileTrigger = styled.div`
  cursor: pointer;
  padding: 15px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid rgba(25, 118, 210, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(25, 118, 210, 0.1);
    transform: translateY(-2px);
  }

  text-align: center;
`;

const ProfilePicture = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 3px solid rgba(25, 118, 210, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(25, 118, 210, 0.6);
    transform: scale(1.05);
  }
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #1976d2;
`;

const UserDetails = styled.div`
  font-size: 12px;
  color: rgba(25, 118, 210, 0.8);
  margin-bottom: 2px;
`;

const Modal = styled.div`
  background: linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%);
  border: 1px solid rgba(25, 118, 210, 0.2);
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  z-index: 1000;
  padding: 15px;
  margin: 0;
  width: 200px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const List = styled.li`
  color: #1976d2;
  font-family: "Nunito", sans-serif;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const SignOut = styled.button`
  background: linear-gradient(45deg, #ff4757 0%, #ff3742 100%);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;

  &:hover {
    box-shadow: 0 6px 16px rgba(255, 71, 87, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
    transform: translateY(0);
  }
`;

export default Sidebar;
