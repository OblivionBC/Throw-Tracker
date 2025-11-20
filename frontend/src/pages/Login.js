import React, { useState } from "react";
import styled from "styled-components";
import "typeface-rubik";
import { Navigate } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import logo from "../images/LogoIcon.png";
import text from "../images/LogoText.png";
import {
  FormContainer,
  Logo,
  PageContent,
  Row,
} from "../styles/design-system";
import LoginForm from "../components/forms/LoginForm";
import SignUpForm from "../components/forms/SignUpForm";
import { useIsAuthenticated } from "../stores/userStore";

const Login = () => {
  const [loginOpen, setLoginOpen] = useState(true);
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <Page>
      <PageContent>
        <Row>
          <Logo src={logo} />
          <Logo src={text} />
        </Row>
        <FormContainer>
          <ErrorBoundary>
            <LoginForm on={loginOpen} off={() => setLoginOpen(false)} />
          </ErrorBoundary>
          <ErrorBoundary>
            <SignUpForm on={!loginOpen} off={() => setLoginOpen(true)} />
          </ErrorBoundary>
        </FormContainer>
      </PageContent>
    </Page>
  );
};

const Page = styled.div`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Rubik", sans-serif;
`;
export default Login;
