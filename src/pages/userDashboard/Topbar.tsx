// pages/userDashboard/Topbar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../supabaseClient";

interface Props { 
  username: string; 
  setUsername: (s:string)=>void; 
  onProfile: ()=>void; 
}

const Topbar: React.FC<Props> = ({ username, setUsername, onProfile }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div style={{display:"flex",gap:10,alignItems:"center"}}>
      <input value={username} onChange={e=>setUsername(e.target.value)} style={{padding:8,borderRadius:10}} />
      <button className="rs-btn ghost" onClick={onProfile}>Profile</button>
      <button 
        className="rs-btn danger" 
        onClick={handleLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: '#dc3545',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        <img
          src="https://img.icons8.com/?size=100&id=98958&format=png&color=ffffff"
          width="16"
          height="16"
          alt="Logout"
        />
        Logout
      </button>
    </div>
  );
};

export default Topbar;
