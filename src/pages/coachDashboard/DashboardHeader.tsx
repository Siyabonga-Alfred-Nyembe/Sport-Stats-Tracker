import React from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../supabaseClient";
import DashboardNav from "./DashboardNav";

interface Props {
  onProfileClick: () => void;
  setActiveTab: (tab: string) => void;
  onReportIssue: () => void;
  username?: string;
}

const DashboardHeader: React.FC<Props> = ({ onProfileClick, setActiveTab, onReportIssue, username }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="dashboard-header">
      <section className="header-content">
        <h1>Coach Dashboard</h1>
        <div className="header-actions">
          {username && (
            <span className="username">Welcome, {username}</span>
          )}
          <button className="profile-icon" onClick={onProfileClick}>
            <img
              src="https://img.icons8.com/?size=100&id=98957&format=png&color=000000"
              width="32"
              height="32"
              alt="Profile"
            />
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <img
              src="https://img.icons8.com/?size=100&id=98958&format=png&color=000000"
              width="24"
              height="24"
              alt="Logout"
            />
            Logout
          </button>
        </div>
      </section>

      <DashboardNav setActiveTab={setActiveTab} onReportIssue={onReportIssue} />
    </header>
  );
};

export default DashboardHeader;
