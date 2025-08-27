import React from "react";

interface Props {
  setActiveTab: (tab: string) => void;
  onReportIssue: () => void;
}

const DashboardNav: React.FC<Props> = ({ setActiveTab, onReportIssue }) => (
  <nav className="dashboard-nav">
    <button onClick={() => setActiveTab("myTeam")}>My Team</button>
    <button onClick={() => setActiveTab("matches")}>Matches</button>
    <button onClick={() => setActiveTab("players")}>Players</button>
    <button onClick={onReportIssue} className="report-btn">Report Issue</button>
  </nav>
);

export default DashboardNav;
