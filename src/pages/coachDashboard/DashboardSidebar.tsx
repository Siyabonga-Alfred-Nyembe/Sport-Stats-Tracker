import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../supabaseClient";
import './sidebar.css';

interface Props {
  onNavigate: (tab: string) => void;
}

const DashboardSidebar: React.FC<Props> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (tab: string) => {
    onNavigate(tab);
    setIsOpen(false); // Close sidebar after navigation
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      {/* Header Area with App Name */}
      <header className="dashboard-header">
        <div className="header-content">
          <button
            className="hamburger-menu"
            onClick={toggleSidebar}
            aria-label="Toggle navigation menu"
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">R&S Sports</h3>
          <button className="close-btn" onClick={toggleSidebar}>
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => handleNavigation("myTeam")}>
            <span className="nav-icon">📊</span>
            Overview
          </button>
          <button onClick={() => handleNavigation("players")}>
            <span className="nav-icon">👥</span>
            Players
          </button>
          <button onClick={() => handleNavigation("matches")}>
            <span className="nav-icon">⚽</span>
            Matches
          </button>

          {/* Logout button moved here */}
          <button className="logout-btn" onClick={handleLogout}>
            <img
              src="https://img.icons8.com/?size=100&id=98958&format=png&color=000000"
              width="24"
              height="24"
              alt="Logout"
            />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;