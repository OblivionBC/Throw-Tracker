import React from "react";
import { useState } from "react";
import LoginForm from "../forms/LoginForm";
import logo from "../../images/ThrowSpace.png";
import SignUpForm from "../forms/SignUpForm";
import { Overlay, ModalContainer, Logo } from "../styles/styles";
const LoginModal = ({ open, onClose, pracObj }) => {
  const [login, setLogin] = useState(true);
  return (
    <Overlay>
      <ModalContainer>
        <Logo src={logo} alt="Throw Logo" />

        <LoginForm on={login} off={() => setLogin(false)} />
        <SignUpForm on={!login} off={() => setLogin(true)} />
      </ModalContainer>
    </Overlay>
  );
};

export default LoginModal;
