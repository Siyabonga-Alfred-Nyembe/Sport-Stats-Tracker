// pages/userDashboard/StatsCards.tsx
import React from "react";
interface Props { teams: number; players: number; matches: number; }
const StatsCards: React.FC<Props> = ({ teams, players, matches }) => (
  <section className="rs-stats">
    <div className="rs-card"><h3>Total Teams</h3><div style={{fontSize:22,fontWeight:800}}>{teams}</div></div>
    <div className="rs-card"><h3>Total Players</h3><div style={{fontSize:22,fontWeight:800}}>{players}</div></div>
    <div className="rs-card"><h3>Matches</h3><div style={{fontSize:22,fontWeight:800}}>{matches}</div></div>
  </section>
);

export default StatsCards;
