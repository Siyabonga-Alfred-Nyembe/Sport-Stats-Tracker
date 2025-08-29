// pages/userDashboard/Topbar.tsx
import React from "react";

interface Props { username: string; setUsername: (s:string)=>void; onProfile: ()=>void; }
const Topbar: React.FC<Props> = ({ username, setUsername, onProfile }) => (
  <div className="rs-topbar">
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:44,height:44,borderRadius:10,display:"grid",placeItems:"center"}}><strong>RS</strong></div>
      <div>
        <div style={{fontWeight:800}}>Redesigned Dashboard</div>
        <div style={{fontSize:12,color:"#6b7280"}}>A modern, focused view of your soccer stats</div>
      </div>
    </div>
    <div style={{display:"flex",gap:10,alignItems:"center"}}>
      <input value={username} onChange={e=>setUsername(e.target.value)} style={{padding:8,borderRadius:10}} />
      <button className="rs-btn ghost" onClick={onProfile}>Profile</button>
    </div>
  </div>
);

export default Topbar;
