import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/dashboard.css";

interface Team {
  id: string;
  name: string;
  isFavorite: boolean;
}

interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  stats: PlayerStats;
}

interface PlayerStats {
  goals: number;
  assists: number;
  minutesPlayed: number;
}

interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  date: string;
  status: "confirmed" | "pending";
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("teams");
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "Team A", isFavorite: false },
    { id: "2", name: "Team B", isFavorite: true },
    { id: "3", name: "Team C", isFavorite: false }
  ]);
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Player 1", teamId: "1", position: "Forward", stats: { goals: 5, assists: 3, minutesPlayed: 450 } },
    { id: "2", name: "Player 2", teamId: "1", position: "Midfielder", stats: { goals: 2, assists: 7, minutesPlayed: 520 } },
    { id: "3", name: "Player 3", teamId: "2", position: "Defender", stats: { goals: 1, assists: 2, minutesPlayed: 600 } }
  ]);
  const [matches] = useState<Match[]>([
    { id: "1", homeTeamId: "1", awayTeamId: "2", homeScore: 2, awayScore: 1, date: "2025-08-01", status: "confirmed" },
    { id: "2", homeTeamId: "2", awayTeamId: "3", homeScore: 0, awayScore: 0, date: "2025-08-05", status: "pending" }
  ]);

  const handleNavigateToPlayers = (teamId: string) => navigate(`/team/${teamId}/players`);
  const handleProfileClick = () => navigate("/profile-settings");
  const handleReportIssue = () => console.log("Opening issue report form");

  const toggleFavorite = (teamId: string) => {
    setTeams(teams.map(team =>
      team.id === teamId ? { ...team, isFavorite: !team.isFavorite } : team
    ));
  };

  return (
    <section className="dashboard user-dashboard">
      <header className="dashboard-header">
        <section className="header-content">
          <h1>User Dashboard</h1>
          <button className="profile-icon" onClick={handleProfileClick}>
            <img src="https://img.icons8.com/?size=100&id=98957&format=png&color=000000" width="32" height="32" alt="Profile" />
          </button>
        </section>
        <nav className="dashboard-nav">
          <button onClick={() => setActiveTab("teams")}>Teams</button>
          <button onClick={() => setActiveTab("players")}>Players</button>
          <button onClick={() => setActiveTab("matches")}>Matches</button>
          <button onClick={() => setActiveTab("favorites")}>Favorites</button>
          <button onClick={handleReportIssue} className="report-btn">Report Issue</button>
        </nav>
      </header>

      {/* Stats Overview Cards */}
      <section className="stats-cards">
        <div className="stat-card violet">
          <h3>{teams.length}</h3>
          <p>Total Teams</p>
        </div>
        <div className="stat-card blue">
          <h3>{players.length}</h3>
          <p>Total Players</p>
        </div>
        <div className="stat-card white">
          <h3>{matches.length}</h3>
          <p>Total Matches</p>
        </div>
      </section>

      <section className="dashboard-content">
        {activeTab === "teams" && (
          <section className="tab-content">
            <h2>All Teams</h2>
            <section className="card-grid">
              {teams.map(team => (
                <div key={team.id} className="card">
                  <h3>{team.name}</h3>
                  <div className="card-actions">
                    <button onClick={() => toggleFavorite(team.id)}>
                      {team.isFavorite ? "★" : "☆"}
                    </button>
                    <button onClick={() => handleNavigateToPlayers(team.id)}>View Players</button>
                  </div>
                </div>
              ))}
            </section>
          </section>
        )}

        {activeTab === "players" && (
          <section className="tab-content">
            <h2>Players</h2>
            <section className="card-grid">
              {players.map(player => {
                const team = teams.find(t => t.id === player.teamId);
                return (
                  <div key={player.id} className="card">
                    <h3>{player.name}</h3>
                    <p>{player.position} – {team?.name}</p>
                    <p>⚽ {player.stats.goals} | 🎯 {player.stats.assists}</p>
                  </div>
                );
              })}
            </section>
          </section>
        )}

        {activeTab === "matches" && (
          <section className="tab-content">
            <h2>Recent Matches</h2>
            <section className="card-grid">
              {matches.map(match => {
                const home = teams.find(t => t.id === match.homeTeamId);
                const away = teams.find(t => t.id === match.awayTeamId);
                return (
                  <div key={match.id} className="card">
                    <h3>{home?.name} vs {away?.name}</h3>
                    <p>Score: {match.homeScore} - {match.awayScore}</p>
                    <p>{match.date} ({match.status})</p>
                  </div>
                );
              })}
            </section>
          </section>
        )}

        {activeTab === "favorites" && (
          <section className="tab-content">
            <h2>Favorite Teams</h2>
            <section className="card-grid">
              {teams.filter(team => team.isFavorite).map(team => (
                <div key={team.id} className="card">
                  <h3>{team.name}</h3>
                  <button onClick={() => toggleFavorite(team.id)}>★ Remove Favorite</button>
                </div>
              ))}
            </section>
          </section>
        )}
      </section>
    </section>
  );
};

export default UserDashboard;
