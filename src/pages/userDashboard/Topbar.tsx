// pages/userDashboard/Topbar.tsx
import React from "react";

interface Props { username: string; setUsername: (s:string)=>void; onProfile: ()=>void; }
const Topbar: React.FC<Props> = ({ username, setUsername, onProfile }) => (
    <div style={{display:"flex",gap:10,alignItems:"center"}}>
      <input value={username} onChange={e=>setUsername(e.target.value)} style={{padding:8,borderRadius:10}} />
      <button className="rs-btn ghost" onClick={onProfile}>Profile</button>
    </div>
);

export default Topbar;
