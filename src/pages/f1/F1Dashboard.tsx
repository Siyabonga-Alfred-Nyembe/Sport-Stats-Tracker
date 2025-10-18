import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import F1Sidebar from "./F1Sidebar";
import "./f1-theme.css";

const F1Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"drivers" | "teams" | "stats" | "f1Results">("drivers");

  return (
    <div className="f1-dashboard" role="region" aria-label="Formula 1 Statistics Dashboard">
      <F1Sidebar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          navigate(`/f1-dashboard/${tab}`);
        }}
      />
      <main className="f1-main" role="main">
        <section className="f1-content" aria-live="polite">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default F1Dashboard;