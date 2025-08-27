import React from "react";
import DashboardNav from "./DashboardNav";

interface Props {
  onProfileClick: () => void;
  setActiveTab: (tab: string) => void;
  onReportIssue: () => void;
}

const DashboardHeader: React.FC<Props> = ({ onProfileClick, setActiveTab, onReportIssue }) => (
  <header className="dashboard-header">
    <section className="header-content">
      <h1>Coach Dashboard</h1>
      <button className="profile-icon" onClick={onProfileClick}>
        <img
          src="https://img.icons8.com/?size=100&id=98957&format=png&color=000000"
          width="32"
          height="32"
          alt="Profile"
        />
      </button>
    </section>

   
    <DashboardNav setActiveTab={setActiveTab} onReportIssue={onReportIssue} />
  </header>
);

export default DashboardHeader;
