import React from "react";
import Navbar from "./components/overlay/Navbar";
import { AppRHS, AppLayout } from "./styles/design-system";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Home from "./pages/Home";

import Login from "./pages/Login";
import Coach from "./pages/Coach";
import Sidebar from "./components/overlay/SideBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { DataChangeProvider } from "./components/contexts/DataChangeContext";
import { ErrorProvider } from "./contexts/ErrorContext";
import ErrorNotifications from "./components/ErrorNotifications";

// New pages for sidebar navigation
import MeasurablesPage from "./pages/MeasurablesPage";
import TrainingPeriodsPage from "./pages/TrainingPeriodsPage";
import PracticeListPage from "./pages/PracticeListPage";
import ChartPage from "./pages/ChartPage";
import MeetsChartPage from "./pages/MeetsChartPage";
import MeetsListPage from "./pages/MeetsListPage";
import MeetsCalendarPage from "./pages/MeetsCalendarPage";
import AthletesPage from "./pages/AthletesPage";
import AthleteDetailPage from "./pages/athletes/AthleteDetailPage";
import ProgramsPage from "./pages/ProgramsPage";
import ProgramDetailPage from "./pages/programs/ProgramDetailPage";
import ProgramEditPage from "./pages/programs/ProgramEditPage";
import ProgramNewPage from "./pages/programs/ProgramNewPage";
import MeetDetailPage from "./pages/meets/MeetDetailPage";
import MeetEditPage from "./pages/meets/MeetEditPage";
import MeetNewPage from "./pages/meets/MeetNewPage";
import PracticeDetailPage from "./pages/practices/PracticeDetailPage";
import PracticeNewPage from "./pages/practices/PracticeNewPage";
import TrainingPeriodEditPage from "./pages/training-periods/TrainingPeriodEditPage";
import TrainingPeriodNewPage from "./pages/training-periods/TrainingPeriodNewPage";
import MeasurableNewPage from "./pages/measurables/MeasurableNewPage";
import MeasurableEditPage from "./pages/measurables/MeasurableEditPage";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

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
                <PracticeListPage />
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
            path="/athletes/:id"
            element={
              <ProtectedRoute>
                <AthleteDetailPage />
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
            path="/programs/new"
            element={
              <ProtectedRoute>
                <ProgramNewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/programs/:id/edit"
            element={
              <ProtectedRoute>
                <ProgramEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/programs/:id"
            element={
              <ProtectedRoute>
                <ProgramDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meets/new"
            element={
              <ProtectedRoute>
                <MeetNewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meets/:id/edit"
            element={
              <ProtectedRoute>
                <MeetEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meets/:id"
            element={
              <ProtectedRoute>
                <MeetDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practices/new"
            element={
              <ProtectedRoute>
                <PracticeNewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practices/:id"
            element={
              <ProtectedRoute>
                <PracticeDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/training-periods/new"
            element={
              <ProtectedRoute>
                <TrainingPeriodNewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/training-periods/:id/edit"
            element={
              <ProtectedRoute>
                <TrainingPeriodEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/measurables/new"
            element={
              <ProtectedRoute>
                <MeasurableNewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/measurables/:id/edit"
            element={
              <ProtectedRoute>
                <MeasurableEditPage />
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
          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
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
    <ErrorProvider>
      <DataChangeProvider>
        <AppLayout>
          <GlobalStyle />
          <Router>
            <AppContent />
            <ErrorNotifications />
          </Router>
        </AppLayout>
      </DataChangeProvider>
    </ErrorProvider>
  );
};

export default App;
