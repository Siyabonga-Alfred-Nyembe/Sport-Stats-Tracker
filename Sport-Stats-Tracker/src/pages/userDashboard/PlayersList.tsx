import React from "react";
import { useNavigate } from "react-router-dom";

interface Player { id: string; name: string; teamId: string; position: string; stats: { goals: number; assists: number; minutesPlayed: number } }
interface Team { id: string; name: string }

interface Props { players: Player[]; teams: Team[] }

const PlayersList: React.FC<Props> = ({ players, teams }) => {
  const navigate = useNavigate();

  const handlePlayerClick = (playerId: string) => {
    navigate(`/players/${playerId}`);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div><h3>Players</h3><div style={{color:"var(--muted)"}}>Click on a player to view detailed statistics</div></div>
      </div>
      <div className="rs-list">
        {players.map(p => {
          const team = teams.find(t=>t.id===p.teamId);
          return (
            <div 
              key={p.id} 
              className="rs-match"
              onClick={() => handlePlayerClick(p.id)}
              style={{ cursor: "pointer" }}
            >
              <div>
                <div style={{fontWeight:800}}>{p.name} <span style={{color:"var(--muted)"}}>{p.position}</span></div>
                <div className="meta">Team: {team?.name || p.teamId}</div>
              </div>
              <div style={{fontWeight:900,minWidth:120,textAlign:"right"}}>G {p.stats.goals} • A {p.stats.assists}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayersList;



