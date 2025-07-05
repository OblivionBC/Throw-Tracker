import React from "react";
import Navbar from "./componenents/overlay/Navbar";
import { AppRHS, AppLayout } from "./styles/styles";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Home from "./pages/Home";
import Practices from "./pages/Practices";
import Meets from "./pages/Meets";
import Login from "./pages/Login";
import Coach from "./pages/Coach";
import Sidebar from "./componenents/overlay/SideBar";
import ProtectedRoute from "./componenents/ProtectedRoute";
import { DataChangeProvider } from "./componenents/contexts/DataChangeContext";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    text-decoration: none;
  }
`;

// Component to conditionally render sidebar
const AppContent = () => {
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/";

  return (
    <>
      {!isLoginPage && <Sidebar />}
      <AppRHS>
        {!isLoginPage && <Navbar />}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practices"
            element={
              <ProtectedRoute>
                <Practices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meets"
            element={
              <ProtectedRoute>
                <Meets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach"
            element={
              <ProtectedRoute>
                <Coach />
              </ProtectedRoute>
            }
          />
          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppRHS>
    </>
  );
};

const App = () => {
  return (
    <DataChangeProvider>
      <AppLayout>
        <GlobalStyle />
        <Router>
          <AppContent />
        </Router>
      </AppLayout>
    </DataChangeProvider>
  );
};

export default App;
