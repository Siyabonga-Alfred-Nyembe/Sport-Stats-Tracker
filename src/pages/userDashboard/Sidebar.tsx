import React, { useState } from "react";
import "./Sidebar.css";

type Tab = "overview" | "teams" | "players" | "matches" | "favorites";
interface Props {
  activeTab: Tab;
  goToTab: (t: Tab) => void;
}

const tabIcons: Record<Tab, string> = {
  overview: "📊",
  teams: "👥",
  players: "🏃",
  matches: "⚽",
  favorites: "⭐",
};

const Sidebar: React.FC<Props> = ({ activeTab, goToTab }) => {
  const [isOpen, setIsOpen] = useState(false);


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  const handleNavigation = (tab: Tab) => {
    goToTab(tab);
    setIsOpen(false);
  };

  return (
    <>
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

      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">R&S Sports</h3>
          <button className="close-btn" onClick={toggleSidebar}>
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          {(["overview", "teams", "players", "matches", "favorites"] as Tab[]).map(
            (t) => (
              <button
                key={t}

                className={activeTab === t ? "active" : ""}
                onClick={() => handleNavigation(t)}
              >
                <span className="nav-icon">{tabIcons[t]}</span>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            )
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;