import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import styled from "styled-components";
import logo from "../../images/LogoIcon.png";
import useUserStore, { useUser, useIsCoach } from "../../stores/userStore";
import { authApi } from "../../api";
import AthleteSelect from "../formHelpers/AthleteSelect";

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [practicesOpen, setPracticesOpen] = useState(false);
  const [meetsOpen, setMeetsOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);

  const [tokenStatus, setTokenStatus] = useState(null);
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
        // Check if click is outside the modal
        const modal = document.querySelector("[data-modal]");
        if (modal && !modal.contains(event.target)) {
          setIsModalOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize token refresh when component mounts
  useEffect(() => {
    // Don't start token refresh if no user
    if (!user) {
      setTokenStatus(null);
      return;
    }
    // Token status checks are handled by the user store, not the sidebar
    // This prevents duplicate interval setup and multiple API calls
  }, [user]);

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
    logoutUser();
    navigate("/login");
  };

  // Dropdown toggles
  const togglePractices = () => setPracticesOpen((open) => !open);
  const toggleMeets = () => setMeetsOpen((open) => !open);
  const toggleCoach = () => setCoachOpen((open) => !open);

  // Function to check token status (only for manual refresh)
  const checkTokenStatus = async () => {
    // Don't check token status if no user is authenticated
    if (!user) {
      setTokenStatus(null);
      return;
    }

    try {
      const status = await authApi.checkTokenStatus();
      setTokenStatus(status);

      // Update token cache with current expiration (refresh token stays the same)
      if (status && status.expiresIn) {
        const { refreshTokenExpirationTime } = useUserStore.getState();
        const refreshTokenExpiresIn = refreshTokenExpirationTime
          ? Math.floor((refreshTokenExpirationTime - Date.now()) / 1000)
          : 604800; // 7 days default
        useUserStore
          .getState()
          .setTokenExpiration(status.expiresIn, refreshTokenExpiresIn);
      }
    } catch (error) {
      console.error("Failed to check token status:", error);
      setTokenStatus(null);

      // If token is expired, immediately handle expired token
      if (
        error.message.includes("401") ||
        error.message.includes("403") ||
        error.message.includes("Authentication failed")
      ) {
        useUserStore.getState().handleExpiredToken();
      }
    }
  };

  return (
    <SidebarContainer data-sidebar>
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

      {/* Token Status Indicator */}
      {tokenStatus && (
        <TokenStatusContainer isexpiring={tokenStatus.isexpiring}>
          <TokenStatusText>
            {tokenStatus.isExpiringSoon
              ? `⚠️ Session expires in ${Math.floor(
                  tokenStatus.expiresIn / 60
                )}m`
              : `✅ Session valid (${Math.floor(
                  tokenStatus.expiresIn / 60
                )}m left)`}
          </TokenStatusText>
        </TokenStatusContainer>
      )}

      <NavSection>
        <NavItem>
          <StyledNavLink to="/home">
            <NavIcon>🏠</NavIcon>
            Home
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <DropdownContainer>
            <DropdownButton onClick={togglePractices} $open={practicesOpen}>
              <ArrowIcon $open={practicesOpen}>▼</ArrowIcon>
              <NavIcon>🏃</NavIcon>
              Practices
            </DropdownButton>
            {practicesOpen && (
              <DropdownMenu>
                <DropdownItem>
                  <StyledNavLink to="/practices">
                    <SubNavIcon>📊</SubNavIcon>
                    Dashboard
                  </StyledNavLink>
                </DropdownItem>
                <DropdownItem>
                  <StyledNavLink to="/practice-charts">
                    <SubNavIcon>📈</SubNavIcon>
                    Chart
                  </StyledNavLink>
                </DropdownItem>
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
                  <StyledNavLink to="/practice-list">
                    <SubNavIcon>📋</SubNavIcon>
                    Practice List
                  </StyledNavLink>
                </DropdownItem>
              </DropdownMenu>
            )}
          </DropdownContainer>
        </NavItem>
        <NavItem>
          <DropdownContainer>
            <DropdownButton onClick={toggleMeets} $open={meetsOpen}>
              <ArrowIcon $open={meetsOpen}>▼</ArrowIcon>
              <NavIcon>🏆</NavIcon>
              Meets
            </DropdownButton>
            {meetsOpen && (
              <DropdownMenu>
                <DropdownItem>
                  <StyledNavLink to="/meets">
                    <SubNavIcon>📊</SubNavIcon>
                    Dashboard
                  </StyledNavLink>
                </DropdownItem>
                <DropdownItem>
                  <StyledNavLink to="/meet-charts">
                    <SubNavIcon>📈</SubNavIcon>
                    Chart
                  </StyledNavLink>
                </DropdownItem>
                <DropdownItem>
                  <StyledNavLink to="/meets-list">
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
          </DropdownContainer>
        </NavItem>
        {isCoach && (
          <NavItem>
            <DropdownContainer>
              <DropdownButton onClick={toggleCoach} $open={coachOpen}>
                <ArrowIcon $open={coachOpen}>▼</ArrowIcon>
                <NavIcon>👨‍💼</NavIcon>
                Coach
              </DropdownButton>
              {coachOpen && (
                <DropdownMenu>
                  <DropdownItem>
                    <StyledNavLink to="/coach">
                      <SubNavIcon>👨‍💼</SubNavIcon>
                      Dashboard
                    </StyledNavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <StyledNavLink to="/athletes">
                      <SubNavIcon>👥</SubNavIcon>
                      Athletes
                    </StyledNavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <StyledNavLink to="/programs">
                      <SubNavIcon>📋</SubNavIcon>
                      Programs
                    </StyledNavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <StyledNavLink to="/measurables">
                      <SubNavIcon>📊</SubNavIcon>
                      Measurables
                    </StyledNavLink>
                  </DropdownItem>
                </DropdownMenu>
              )}
            </DropdownContainer>
          </NavItem>
        )}
      </NavSection>
      {isCoach && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            padding: "0 15px",
            zIndex: 5,
          }}
        >
          <div
            style={{ fontSize: "10px", color: "#1976d2", marginBottom: "5px" }}
          >
            Coach Tools:
          </div>
          <AthleteSelect org_name={user?.org_name} updateUser={true} />
        </div>
      )}
      {isModalOpen && (
        <ModalWrapper>
          <Modal top={modalPosition.top} left={modalPosition.left} data-modal>
            <List>
              <UserName>
                {user ? `${user.first_nm} ${user.last_nm}` : "User"}
              </UserName>
              <UserDetails>{user?.role}</UserDetails>
              <UserDetails>{user?.org_name}</UserDetails>
            </List>

            <ProfileButton onClick={() => navigate("/profile")}>
              Profile
            </ProfileButton>
            <SignOut onClick={handleSignOut}>Sign Out</SignOut>
          </Modal>
        </ModalWrapper>
      )}
    </SidebarContainer>
  );
};

// Styled Components
const SidebarContainer = styled.div`
  min-width: 150px;
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
  flex-shrink: 0; /* Prevent sidebar from shrinking */
  position: fixed; /* Keep sidebar fixed */
  left: 0;
  top: 0;
  z-index: 2;
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
  padding: 10px 15px;
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
  padding: 10px 15px;
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
  }
`;

const DropdownContainer = styled.div`
  width: 100%;
`;

const ArrowIcon = styled.span`
  font-size: 16px;
  margin-right: 8px;
  margin-left: 8px;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.$open ? "rotate(180deg)" : "rotate(0deg)")};
  cursor: pointer;
  padding: 2px;

  &:hover {
    background: rgba(25, 118, 210, 0.1);
    border-radius: 4px;
  }
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

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
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
  pointer-events: auto;

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

const ProfileButton = styled.button`
  background: linear-gradient(45deg, #4caf50 0%, #45a049 100%);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;

  &:hover {
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    transform: translateY(0);
  }
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
  z-index: 1000;

  &:hover {
    box-shadow: 0 6px 16px rgba(255, 71, 87, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
    transform: translateY(0);
  }
`;

const TokenStatusContainer = styled.div`
  background-color: ${(props) => (props.isexpiring ? "#ffd2d2" : "#dff2bf")};
  border: 1px solid ${(props) => (props.isexpiring ? "#a94442" : "#4f8a10")};
  color: ${(props) => (props.isexpiring ? "#a94442" : "#4f8a10")};
  padding: 5px 10px;
  border-radius: 4px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const TokenStatusText = styled.span`
  font-size: 12px;
  font-weight: bold;
`;

export default Sidebar;
