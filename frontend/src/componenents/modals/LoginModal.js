import React from "react";
import styled from "styled-components";
import { useState } from "react";
import LoginForm from "../forms/LoginForm";
import logo from "../../images/ThrowSpace.png";
import SignUpForm from "../forms/SignUpForm";

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

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
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
  max-width: 1400px;
  width: 70%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  background-color: white;
  border-radius: 15px;
  padding: 10px;
  box-sizing: border-box;
`;
const Logo = styled.img`
  max-height: 20vh;
  object-fit: contain;
  margin-bottom: 20px;
`;
export default LoginModal;
