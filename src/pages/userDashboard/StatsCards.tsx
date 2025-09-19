// pages/userDashboard/StatsCards.tsx
import "./StatCard.css" 
import React from "react";
interface Props { teams: number; players: number; matches: number; }
const StatsCards: React.FC<Props> = ({ teams, players, matches }) => (
  <section className="rs-stats">
    <div className="rs-card"><h3>Total Teams</h3><div >{teams}</div></div>
    <div className="rs-card"><h3>Total Players</h3><div>{players}</div></div>
    <div className="rs-card"><h3>Matches</h3><div>{matches}</div></div>
  </section>
);

export default StatsCards;
