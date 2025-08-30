// pages/userDashboard/Sidebar.tsx
import React from "react";
type Tab = "overview"|"teams"|"players"|"matches"|"favorites";
interface Props { activeTab: Tab; goToTab: (t:Tab)=>void; }
const Sidebar: React.FC<Props> = ({ activeTab, goToTab }) => (
  <aside className="rs-sidebar">
    <div className="rs-brand">R&S Sports</div>
    <nav className="rs-nav">
      {(["overview","teams","players","matches","favorites"] as Tab[]).map(t=>(
        <button key={t} className={activeTab===t?"active":""} onClick={()=>goToTab(t)}>{t[0].toUpperCase()+t.slice(1)}</button>
      ))}
    </nav>
    <div style={{marginTop:16}} className="rs-card">
      <div style={{fontSize:13,color:"var(--muted)"}}>Quick Actions</div>
      <div style={{display:"flex",gap:8}}><button className="rs-btn">Export</button><button className="rs-btn ghost">Import</button></div>
    </div>
  </aside>
);

export default Sidebar;
