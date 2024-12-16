import React from "react";
import Navbar from "./componenents/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Home from "./pages/Home";
import Practices from "./pages/Practices";
import Meets from "./pages/Meets";
import LoginModal from "./componenents/modals/LoginModal";
import Coach from "./pages/Coach";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    text-decoration: none;
  }
    
`;

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginModal />} />
          <Route path="/home" element={<Home />} />
          <Route path="/practices" element={<Practices />} />
          <Route path="/meets" element={<Meets />} />
          <Route path="/coach" element={<Coach />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
