// pages/userDashboard/MatchList.tsx
import React from "react";
import type { Match, Team } from "./types";

interface Props {
  matches: Match[];
  teams: Team[];
  query: string;
  setQuery: (s:string)=>void;
  onOpen: (id:string)=>void;
}

const MatchesList: React.FC<Props> = ({matches, teams, query, setQuery, onOpen}) => {
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div><h3>Matches</h3><div style={{color:"var(--muted)"}}>Search and open a match to view details & chat</div></div>
        <div className="rs-actions">
          <input placeholder="Search teams or dates" value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="rs-btn ghost" onClick={()=>setQuery("")}>Clear</button>
        </div>
      </div>

      <div className="rs-list">
        {matches.map(m=>{
          const home = teams.find(t=>t.id===m.homeTeamId); const away = teams.find(t=>t.id===m.awayTeamId);
          return (
            <div key={m.id} className="rs-match">
              <div>
                <div style={{fontWeight:800}}>{home?.name} <span style={{color:"var(--muted)"}}>vs</span> {away?.name}</div>
                <div className="meta">{m.date} • {m.status}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div style={{fontWeight:900,minWidth:58,textAlign:"center"}}>{m.homeScore} - {m.awayScore}</div>
                <button className="rs-btn ghost" onClick={()=>{ navigator.clipboard?.writeText(`${home?.name} ${m.homeScore}-${m.awayScore} ${away?.name}`); alert("Copied score to clipboard"); }}>Share</button>
                <button className="rs-btn" onClick={()=>onOpen(m.id)}>Details</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchesList;
