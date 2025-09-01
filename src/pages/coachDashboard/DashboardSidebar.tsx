import React from "react";

interface Props {
  onNavigate: (tab: string) => void;
}

const DashboardSidebar: React.FC<Props> = ({ onNavigate }) => {
  return (
    <aside className="coach-sidebar">
      <h3 className="sidebar-title">R&S Sports</h3>
      <nav className="sidebar-nav">
        <button onClick={() => onNavigate('matches')}>Overview</button>
        <button onClick={() => onNavigate('myTeam')}>Teams</button>
        <button onClick={() => onNavigate('players')}>Players</button>
        <button onClick={() => onNavigate('matches')}>Matches</button>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;


