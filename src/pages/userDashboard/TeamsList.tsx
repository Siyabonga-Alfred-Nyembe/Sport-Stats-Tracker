import React from "react";
import { useFavoriteTeams } from "./hooks/useFavorites";

interface Team { id: string; name: string; isFavorite?: boolean }

interface Props { teams: Team[] }

const TeamsList: React.FC<Props> = ({ teams }) => {
  const { isFavorite, toggleFavorite, loading } = useFavoriteTeams();
  
  const handleStarClick = (teamId: string) => {
    console.log('Star clicked for team:', teamId, 'Current favorite status:', isFavorite(teamId));
    toggleFavorite(teamId);
  };
  
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div><h3>Teams</h3><div style={{color:"var(--muted)"}}>All teams referenced in your matches/players</div></div>
      </div>
      <div className="rs-list">
        {teams.map(t => (
          <div key={t.id} className="rs-match">
            <div style={{fontWeight:800}}>{t.name}</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button
                aria-label={isFavorite(t.id) ? "Remove from favorites" : "Add to favorites"}
                className="rs-btn ghost"
                onClick={() => handleStarClick(t.id)}
                title={isFavorite(t.id) ? "Unfavorite" : "Favorite"}
                disabled={loading}
                style={{ 
                  fontSize: '18px', 
                  color: isFavorite(t.id) ? '#ffd700' : '#ccc',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >{isFavorite(t.id) ? "★" : "☆"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsList;
