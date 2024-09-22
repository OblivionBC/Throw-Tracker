import React from "react";
import styled from "styled-components";
import { useState } from "react";
import LoginForm from "../forms/LoginForm";
import logo from "../../images/ThrowLogo.png";
import SignUpForm from "../forms/SignUpForm";

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  padding: 12px 24px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.9);
  width: 100%;
  height: 100%;
`;
const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 900px;
  width: 100%;
  position: fixed;
  background-color: white;
  border-radius: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const Logo = styled.img`
  height: 100px;
`;

const LoginModal = ({ open, onClose, pracObj }) => {
  const [login, setLogin] = useState(true);
  return (
    <Modal>
      <Overlay>
        <ModalContainer>
          <Logo src={logo} alt="Throw Logo" />

          <LoginForm on={login} off={() => setLogin(false)} />
          <SignUpForm on={!login} off={() => setLogin(true)} />
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

export default LoginModal;
