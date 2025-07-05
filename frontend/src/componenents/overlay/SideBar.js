import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import styled from "styled-components";
import logo from "../../images/LogoIcon.png";
import useUserStore, { useUser, useIsCoach } from "../../stores/userStore";
import { authApi } from "../../api";

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [practicesOpen, setPracticesOpen] = useState(false);
  const [meetsOpen, setMeetsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    show: false,
  });
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
        setIsModalOpen(false);
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

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "", show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

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

  // Manual token refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const refreshResponse = await authApi.refreshToken();

      // Update token cache with new expiration
      if (
        refreshResponse &&
        refreshResponse.accessTokenExpiresIn &&
        refreshResponse.refreshTokenExpiresIn
      ) {
        useUserStore
          .getState()
          .setTokenExpiration(
            refreshResponse.accessTokenExpiresIn,
            refreshResponse.refreshTokenExpiresIn
          );
      }

      // Update token status after refresh
      await checkTokenStatus();
      // Show success feedback
      setNotification({
        message: "Token refreshed successfully!",
        type: "success",
        show: true,
      });
    } catch (error) {
      console.error("Manual token refresh failed:", error);
      setNotification({
        message: "Token refresh failed. Please log in again.",
        type: "error",
        show: true,
      });
      handleSignOut();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Dropdown toggles
  const togglePractices = () => setPracticesOpen((open) => !open);
  const toggleMeets = () => setMeetsOpen((open) => !open);

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
    <SidebarContainer>
      {/* Notification */}
      {notification.show && (
        <NotificationContainer type={notification.type}>
          {notification.message}
        </NotificationContainer>
      )}

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

      {/* Refresh Token Button */}
      <RefreshButtonContainer>
        <SidebarRefreshButton
          onClick={handleManualRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? "🔄 Refreshing..." : "🔄 Refresh Token"}
        </SidebarRefreshButton>
      </RefreshButtonContainer>

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
          <RefreshButton onClick={handleManualRefresh} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing..." : "🔄 Refresh Token"}
          </RefreshButton>
          <SignOut onClick={handleSignOut}>Sign Out</SignOut>
        </Modal>
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
  z-index: 1;
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

const RefreshButton = styled.button`
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
  margin-bottom: 10px;

  &:hover:not(:disabled) {
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    transform: translateY(0);
  }

  &:disabled {
    background: linear-gradient(45deg, #cccccc 0%, #bbbbbb 100%);
    cursor: not-allowed;
    opacity: 0.7;
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

  &:hover {
    box-shadow: 0 6px 16px rgba(255, 71, 87, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
    transform: translateY(0);
  }
`;

const RefreshButtonContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const SidebarRefreshButton = styled.button`
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

  &:hover:not(:disabled) {
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    transform: translateY(0);
  }

  &:disabled {
    background: linear-gradient(45deg, #cccccc 0%, #bbbbbb 100%);
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const NotificationContainer = styled.div`
  background-color: ${(props) =>
    props.type === "success" ? "#dff2bf" : "#ffd2d2"};
  border: 1px solid
    ${(props) => (props.type === "success" ? "#4f8a10" : "#a94442")};
  color: ${(props) => (props.type === "success" ? "#4f8a10" : "#a94442")};
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
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
