import React from "react";
import { useNavigate } from "react-router-dom";

interface Team {
  id: string;
  name: string;
  isFavorite?: boolean;
}

interface Props {
  teams: Team[];
  isFavorite: (teamId: string) => boolean;
  toggleFavorite: (teamId: string) => Promise<void>;
  loading: boolean;
}

const TeamsList: React.FC<Props> = ({ teams, isFavorite, toggleFavorite, loading }) => {
  const [togglingTeamId, setTogglingTeamId] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleStarClick = async (teamId: string) => {
    console.log(
      "Star clicked for team:",
      teamId,
      "Current favorite status:",
      isFavorite(teamId)
    );
    setTogglingTeamId(teamId);
    try {
      await toggleFavorite(teamId);
    } finally {
      setTogglingTeamId(null);
    }
  };

  return (
    <section>
      <header style={{ marginBottom: 12 }}>
        <h2>Teams</h2>
        <p style={{ color: "var(--muted)" }}>
          All teams referenced in your matches/players
        </p>
      </header>

      <ul className="rs-list">
        {teams.map((t) => (
          <li
            key={t.id}
            className="rs-match"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            {/* Navigate to Team Stats */}
            <button
              className="team-link"
              onClick={() => navigate(`/teams/${t.id}/stats`)}
              style={{
                fontWeight: 800,
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {t.name}
            </button>

            {/* Favorite star button */}
            <button
              aria-label={isFavorite(t.id) ? "Remove from favorites" : "Add to favorites"}
              className="rs-btn ghost"
              onClick={() => handleStarClick(t.id)}
              title={isFavorite(t.id) ? "Unfavorite" : "Favorite"}
              disabled={loading || togglingTeamId === t.id}
              style={{
                fontSize: "18px",
                color: isFavorite(t.id) ? "#ffd700" : "#ccc",
                cursor: loading || togglingTeamId === t.id ? "not-allowed" : "pointer",
                opacity: loading || togglingTeamId === t.id ? 0.6 : 1,
              }}
            >
              {togglingTeamId === t.id ? "⏳" : isFavorite(t.id) ? "★" : "☆"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TeamsList;
