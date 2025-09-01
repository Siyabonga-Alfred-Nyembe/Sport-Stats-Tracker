// pages/userDashboard/Sidebar.tsx
import React from "react";
import menImg from "../../images/menu.png"

type Tab = "overview"|"teams"|"players"|"matches"|"favorites";
interface Props { activeTab: Tab; goToTab: (t:Tab)=>void; }

const Sidebar: React.FC<Props> = ({ activeTab, goToTab }) => (
  <>
    <header>
      <img src={menImg} alt="Menu" className="userMenImg"/>
      <div className="rs-brand">R&S Sports</div>
      
      {/* Navigation moved inside header for CSS sibling selector to work */}
      <nav className="rs-nav">
        {(["overview","teams","players","matches","favorites"] as Tab[]).map(t=>(
          <button key={t} className={activeTab===t?"active":""} onClick={()=>goToTab(t)}>
            {t[0].toUpperCase()+t.slice(1)}
          </button>
        ))}
      </nav>
    </header>
  </>
);

export default Sidebar;