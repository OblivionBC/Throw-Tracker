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
// New pages for sidebar navigation
import MeasurablesPage from "./pages/MeasurablesPage";
import TrainingPeriodsPage from "./pages/TrainingPeriodsPage";
import PracticeListPage from "./pages/PracticeListPage";
import ChartPage from "./pages/ChartPage";
import MeetsChartPage from "./pages/MeetsChartPage";
import MeetsListPage from "./pages/MeetsListPage";
import MeetsCalendarPage from "./pages/MeetsCalendarPage";
import AthletesPage from "./pages/AthletesPage";
import ProgramsPage from "./pages/ProgramsPage";
import Profile from "./pages/Profile";

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
            path="/meets"
            element={
              <ProtectedRoute>
                <Meets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meets-list"
            element={
              <ProtectedRoute>
                <MeetsListPage />
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
          {/* New sidebar navigation routes */}
          <Route
            path="/measurables"
            element={
              <ProtectedRoute>
                <MeasurablesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/training-periods"
            element={
              <ProtectedRoute>
                <TrainingPeriodsPage />
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
            path="/practice-list"
            element={
              <ProtectedRoute>
                <PracticeListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice-charts"
            element={
              <ProtectedRoute>
                <ChartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meet-charts"
            element={
              <ProtectedRoute>
                <MeetsChartPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meet-calendar"
            element={
              <ProtectedRoute>
                <MeetsCalendarPage />
              </ProtectedRoute>
            }
          />
          {/* Coach dropdown routes */}
          <Route
            path="/athletes"
            element={
              <ProtectedRoute>
                <AthletesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/programs"
            element={
              <ProtectedRoute>
                <ProgramsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
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
