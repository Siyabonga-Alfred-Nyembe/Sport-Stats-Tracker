import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/dashboard.css";

interface Team {
  id: string;
  name: string;
  coachId: string;
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
  yellowCards: number;
  redCards: number;
}

interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  date: string;
  status: "scheduled" | "completed" | "pending";
}

const CoachDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("myTeam");
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerPosition, setNewPlayerPosition] = useState("");
  const [newPlayerTeamId, setNewPlayerTeamId] = useState("");
  const [newMatchHomeTeamId, setNewMatchHomeTeamId] = useState("");
  const [newMatchAwayTeamId, setNewMatchAwayTeamId] = useState("");
  const [newMatchDate, setNewMatchDate] = useState("");

  const handleNavigateToTeams = () => navigate("/teams");
  const handleNavigateToTeamStats = (teamId: string) => navigate(`/team/${teamId}/stats`);
  const handleNavigateToPlayers = (teamId: string) => navigate(`/team/${teamId}/players`);
  const handleProfileClick = () => navigate("/profile-settings");

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;
    
    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName.trim(),
      coachId: "current-user-id"
    };
    setTeams([...teams, newTeam]);
    setNewTeamName("");
  };

  const handleAddMatch = () => {
    if (!newMatchHomeTeamId || !newMatchAwayTeamId || !newMatchDate) return;
    
    const newMatch: Match = {
      id: Date.now().toString(),
      homeTeamId: newMatchHomeTeamId,
      awayTeamId: newMatchAwayTeamId,
      homeScore: 0,
      awayScore: 0,
      date: newMatchDate,
      status: "scheduled"
    };
    setMatches([...matches, newMatch]);
    setNewMatchHomeTeamId("");
    setNewMatchAwayTeamId("");
    setNewMatchDate("");
  };

  const handleUpdateMatchStats = (matchId: string, stats: Partial<Match>) => {
    setMatches(matches.map(match => 
      match.id === matchId ? { ...match, ...stats } : match
    ));
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim() || !newPlayerPosition.trim() || !newPlayerTeamId) return;
    
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName.trim(),
      teamId: newPlayerTeamId,
      position: newPlayerPosition.trim(),
      stats: { goals: 0, assists: 0, minutesPlayed: 0, yellowCards: 0, redCards: 0 }
    };
    setPlayers([...players, newPlayer]);
    setNewPlayerName("");
    setNewPlayerPosition("");
    setNewPlayerTeamId("");
  };

  const handleUpdatePlayerStats = (playerId: string, stats: Partial<PlayerStats>) => {
    setPlayers(players.map(player =>
      player.id === playerId ? { ...player, stats: { ...player.stats, ...stats } } : player
    ));
  };

  const handleExportStats = (type: "team" | "player", id: string) => console.log(`Exporting ${type} stats for ID: ${id}`);
  const handleReportIssue = () => console.log("Opening issue report form");

  return (
    <section className="dashboard coach-dashboard">
      <header className="dashboard-header">
        <section className="header-content">
          <h1>Coach Dashboard</h1>
          <button className="profile-icon" onClick={handleProfileClick}>
            <img src="https://img.icons8.com/?size=100&id=98957&format=png&color=000000" width="32" height="32" alt="Profile" />
          </button>
        </section>
        <nav className="dashboard-nav">
          <button onClick={() => setActiveTab("myTeam")}>My Team</button>
          <button onClick={() => setActiveTab("matches")}>Matches</button>
          <button onClick={() => setActiveTab("players")}>Players</button>
          <button onClick={() => setActiveTab("otherTeams")}>Other Teams</button>
          <button onClick={handleReportIssue} className="report-btn">Report Issue</button>
        </nav>
      </header>

      <section className="dashboard-content">
        {activeTab === "myTeam" && (
          <section className="tab-content">
            <h2>My Team Management</h2>
            <section className="form-section">
              <input
                type="text"
                placeholder="Team name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
              <button onClick={handleCreateTeam}>Create New Team</button>
            </section>
            <section className="teams-list">
              <h3>Your Teams</h3>
              {teams.map(team => (
                <section key={team.id} className="team-item">
                  <span>{team.name}</span>
                  <button onClick={() => handleNavigateToTeamStats(team.id)}>View Stats</button>
                  <button onClick={() => handleNavigateToPlayers(team.id)}>Manage Players</button>
                </section>
              ))}
            </section>
          </section>
        )}

        {activeTab === "matches" && (
          <section className="tab-content">
            <h2>Match Management</h2>
            <section className="form-section">
              <select value={newMatchHomeTeamId} onChange={(e) => setNewMatchHomeTeamId(e.target.value)}>
                <option value="">Select Home Team</option>
                {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
              </select>
              <select value={newMatchAwayTeamId} onChange={(e) => setNewMatchAwayTeamId(e.target.value)}>
                <option value="">Select Away Team</option>
                {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
              </select>
              <input
                type="date"
                value={newMatchDate}
                onChange={(e) => setNewMatchDate(e.target.value)}
              />
              <button onClick={handleAddMatch}>Add New Match</button>
            </section>
            <section className="matches-list">
              <h3>Scheduled Matches</h3>
              {matches.map(match => (
                <section key={match.id} className="match-item">
                  <span>{teams.find(t => t.id === match.homeTeamId)?.name} vs {teams.find(t => t.id === match.awayTeamId)?.name}</span>
                  <span> - {new Date(match.date).toLocaleDateString()}</span>
                  <button onClick={() => handleUpdateMatchStats(match.id, { status: "completed" })}>Complete Match</button>
                </section>
              ))}
            </section>
          </section>
        )}

        {activeTab === "players" && (
          <section className="tab-content">
            <h2>Player Management</h2>
            <section className="form-section">
              <input
                type="text"
                placeholder="Player name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Position"
                value={newPlayerPosition}
                onChange={(e) => setNewPlayerPosition(e.target.value)}
              />
              <select value={newPlayerTeamId} onChange={(e) => setNewPlayerTeamId(e.target.value)}>
                <option value="">Select Team</option>
                {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
              </select>
              <button onClick={handleAddPlayer}>Add New Player</button>
            </section>
            <section className="players-list">
              <h3>Your Players</h3>
              {players.map(player => (
                <section key={player.id} className="player-item">
                  <span>{player.name} ({player.position}) - {teams.find(t => t.id === player.teamId)?.name}</span>
                  <button onClick={() => handleUpdatePlayerStats(player.id, { goals: player.stats.goals + 1 })}>Add Goal</button>
                </section>
              ))}
            </section>
          </section>
        )}

        {activeTab === "otherTeams" && (
          <section className="tab-content">
            <h2>Other Teams' Stats</h2>
            <p>Browse and compare statistics from other teams in the league.</p>
          </section>
        )}
      </section>
    </section>
  );
};

export default CoachDashboard;