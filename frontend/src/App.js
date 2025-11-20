import React, { Suspense, lazy } from "react";
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
import Sidebar from "./components/overlay/SideBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { DataChangeProvider } from "./components/contexts/DataChangeContext";
import { ErrorProvider } from "./contexts/ErrorContext";
import ErrorNotifications from "./components/ErrorNotifications";

// Lazy load route components for code splitting
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Coach = lazy(() => import("./pages/Coach"));
const MeasurablesPage = lazy(() => import("./pages/MeasurablesPage"));
const TrainingPeriodsPage = lazy(() => import("./pages/TrainingPeriodsPage"));
const PracticeListPage = lazy(() => import("./pages/PracticeListPage"));
const ChartPage = lazy(() => import("./pages/ChartPage"));
const MeetsChartPage = lazy(() => import("./pages/MeetsChartPage"));
const MeetsListPage = lazy(() => import("./pages/MeetsListPage"));
const MeetsCalendarPage = lazy(() => import("./pages/MeetsCalendarPage"));
const AthletesPage = lazy(() => import("./pages/AthletesPage"));
const AthleteDetailPage = lazy(() => import("./pages/athletes/AthleteDetailPage"));
const ProgramsPage = lazy(() => import("./pages/ProgramsPage"));
const ProgramDetailPage = lazy(() => import("./pages/programs/ProgramDetailPage"));
const ProgramEditPage = lazy(() => import("./pages/programs/ProgramEditPage"));
const ProgramNewPage = lazy(() => import("./pages/programs/ProgramNewPage"));
const MeetDetailPage = lazy(() => import("./pages/meets/MeetDetailPage"));
const MeetEditPage = lazy(() => import("./pages/meets/MeetEditPage"));
const MeetNewPage = lazy(() => import("./pages/meets/MeetNewPage"));
const PracticeDetailPage = lazy(() => import("./pages/practices/PracticeDetailPage"));
const PracticeNewPage = lazy(() => import("./pages/practices/PracticeNewPage"));
const TrainingPeriodEditPage = lazy(() => import("./pages/training-periods/TrainingPeriodEditPage"));
const TrainingPeriodNewPage = lazy(() => import("./pages/training-periods/TrainingPeriodNewPage"));
const MeasurableNewPage = lazy(() => import("./pages/measurables/MeasurableNewPage"));
const MeasurableEditPage = lazy(() => import("./pages/measurables/MeasurableEditPage"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    height: "100vh",
    fontSize: "18px",
    color: "#666"
  }}>
    Loading...
  </div>
);

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
        <Suspense fallback={<LoadingFallback />}>
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
        </Suspense>
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
