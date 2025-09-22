import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import CoachDashboard from "./pages/coachDashboard/CoachDashboard";
import ProfileSettings from "./pages/ProfileSettings";
import AuthCallback from "./pages/authCallback";
import TeamSetup from "./pages/TeamSetup";
import UserDashboard from "./pages/userDashboard/RedesignedDashboard";
import RedesignedDashboard from "./pages/userDashboard/RedesignedDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import TeamStatsPage from "./pages/userDashboard/TeamStatsPage";

function App() {
  return (
    <Router>
      <section
        className="App"
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Routes>
          <Route path="/teams/:teamId/stats" element={<TeamStatsPage />} />
          {/* Public Routes */}
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth-callback" element={<AuthCallback />} />

          {/* Fan Routes */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute requiredRole="Fan" redirectTo="/login">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/players/:playerId"
            element={
              <ProtectedRoute requiredRole="Fan" redirectTo="/login">
                <RedesignedDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overview"
            element={
              <ProtectedRoute requiredRole="Fan" redirectTo="/login">
                <RedesignedDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams"
            element={
              <ProtectedRoute requiredRole="Fan" redirectTo="/login">
                <RedesignedDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/players"
            element={
              <ProtectedRoute requiredRole="Fan" redirectTo="/login">
                <RedesignedDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedRoute requiredRole="Fan" redirectTo="/login">
                <RedesignedDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches/:id"
            element={
              <ProtectedRoute requiredRole="Fan" redirectTo="/login">
                <RedesignedDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute requiredRole="Fan" redirectTo="/login">
                <RedesignedDashboard />
              </ProtectedRoute>
            }
          />

          {/* Coach Routes */}
          <Route
            path="/coach-dashboard"
            element={
              <ProtectedRoute requiredRole="Coach" redirectTo="/login">
                <CoachDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-setup"
            element={
              <ProtectedRoute requiredRole="Coach" redirectTo="/login">
                <TeamSetup />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="Admin" redirectTo="/login">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Shared Routes */}
          <Route
            path="/profile-settings"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />

          {/* Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </section>
    </Router>
  );
}

export default App;