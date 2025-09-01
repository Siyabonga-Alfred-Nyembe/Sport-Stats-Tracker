import React, { useState } from "react";

interface Props {
  onNavigate: (tab: string) => void;
}

const DashboardSidebar: React.FC<Props> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (tab: string) => {
    onNavigate(tab);
    setIsOpen(false); // Close sidebar after navigation
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
          <h1 className="app-title">R&S Sports</h1>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">R&S Sports</h3>
          <button className="close-btn" onClick={toggleSidebar}>
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => handleNavigation('matches')}>
            <span className="nav-icon">📊</span>
            Overview
          </button>
          <button onClick={() => handleNavigation('myTeam')}>
            <span className="nav-icon">🏆</span>
            Teams
          </button>
          <button onClick={() => handleNavigation('players')}>
            <span className="nav-icon">👥</span>
            Players
          </button>
          <button onClick={() => handleNavigation('matches')}>
            <span className="nav-icon">⚽</span>
            Matches
          </button>
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;


