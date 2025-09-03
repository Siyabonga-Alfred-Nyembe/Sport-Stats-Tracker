import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgot";
import ResetPassword from "./pages/reset";
import Land from "./pages/land";
import CoachDashboard from "./pages/coachDashboard/CoachDashboard";
import ProfileSettings from "./pages/ProfileSettings";
import AuthCallback from "./pages/authCallback";
import TeamSetup from "./pages/TeamSetup";
import UserDashboard from "./pages/userDashboard/RedesignedDashboard";
import RedesignedDashboard from "./pages/userDashboard/RedesignedDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <section className="App" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/land" element={<Land />} />
          
          {/* Protected Routes */}
          <Route path="/coach-dashboard" element={
            <ProtectedRoute requiredRole="Coach" redirectTo="/login">
              <CoachDashboard />
            </ProtectedRoute>
          } />
          <Route path="/team-setup" element={
            <ProtectedRoute requiredRole="Coach" redirectTo="/login">
              <TeamSetup />
            </ProtectedRoute>
          } />
          <Route path="/user-dashboard" element={
            <ProtectedRoute requiredRole="Fan" redirectTo="/login">
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile-settings" element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          } />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/players/:playerId" element={<RedesignedDashboard />} />
          <Route path="/overview" element={
            <ProtectedRoute requiredRole="Fan" redirectTo="/login">
              <RedesignedDashboard />
            </ProtectedRoute>
          } />
          <Route path="/teams" element={
            <ProtectedRoute requiredRole="Fan" redirectTo="/login">
              <RedesignedDashboard />
            </ProtectedRoute>
          } />
          <Route path="/players" element={
            <ProtectedRoute requiredRole="Fan" redirectTo="/login">
              <RedesignedDashboard />
            </ProtectedRoute>
          } />
          <Route path="/matches" element={
            <ProtectedRoute requiredRole="Fan" redirectTo="/login">
              <RedesignedDashboard />
            </ProtectedRoute>
          } />
          <Route path="/matches/:id" element={
            <ProtectedRoute requiredRole="Fan" redirectTo="/login">
              <RedesignedDashboard />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute requiredRole="Fan" redirectTo="/login">
              <RedesignedDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </section>
    </Router>
  );
}

export default App;
