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
import "./App.css";

function App() {
  return (
    <Router>
      <section className="App" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route path="/" element={<CoachDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/land" element={<Land />} />
          <Route path="/coach-dashboard" element={<CoachDashboard />} />
          <Route path="/team-setup" element={<TeamSetup />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/overview" element={<RedesignedDashboard />} />
          <Route path="/teams" element={<RedesignedDashboard />} />
          <Route path="/players" element={<RedesignedDashboard />} />
          <Route path="/matches" element={<RedesignedDashboard />} />
          <Route path="/matches/:id" element={<RedesignedDashboard />} />
          <Route path="/favorites" element={<RedesignedDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </section>
    </Router>
  );
}

export default App;
