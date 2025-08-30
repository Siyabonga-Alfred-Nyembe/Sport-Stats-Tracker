// src/pages/coachDashboard/StatCard.tsx
import React from 'react';
import './MyTeamTab.css';

interface Props {
  label: string;
  value: string | number;
}

const StatCard: React.FC<Props> = ({ label, value }) => (
  <div className="rs-card stat-card">
    <span className="stat-card-value">{value}</span>
    <span className="stat-card-label">{label}</span>
  </div>
);

export default StatCard;