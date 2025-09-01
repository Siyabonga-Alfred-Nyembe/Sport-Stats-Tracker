import React from "react";

interface Team { id: string; name: string; isFavorite?: boolean }

interface Props { 
  teams: Team[];
  isFavorite: (teamId: string) => boolean;
  toggleFavorite: (teamId: string) => Promise<void>;
  loading: boolean;
}

const TeamsList: React.FC<Props> = ({ teams, isFavorite, toggleFavorite, loading }) => {
  const [togglingTeamId, setTogglingTeamId] = React.useState<string | null>(null);
  
  const handleStarClick = async (teamId: string) => {
    console.log('Star clicked for team:', teamId, 'Current favorite status:', isFavorite(teamId));
    setTogglingTeamId(teamId);
    try {
      await toggleFavorite(teamId);
    } finally {
      setTogglingTeamId(null);
    }
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
                disabled={loading || togglingTeamId === t.id}
                style={{ 
                  fontSize: '18px', 
                  color: isFavorite(t.id) ? '#ffd700' : '#ccc',
                  cursor: (loading || togglingTeamId === t.id) ? 'not-allowed' : 'pointer',
                  opacity: (loading || togglingTeamId === t.id) ? 0.6 : 1
                }}
              >
                {togglingTeamId === t.id ? "⏳" : (isFavorite(t.id) ? "★" : "☆")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsList;
