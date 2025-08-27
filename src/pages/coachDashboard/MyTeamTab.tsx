import React, { useState } from "react";

export interface Team {
  id: string;
  name: string;
  coachId: string;
}



interface Props {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  navigate: (path: string) => void;
}

const MyTeamTab: React.FC<Props> = ({ teams, setTeams, navigate }) => {
  const [newTeamName, setNewTeamName] = useState("");

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;
    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName.trim(),
      coachId: "current-user-id",
    };
    setTeams([...teams, newTeam]);
    setNewTeamName("");
  };

  return (
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
        {teams.map((team) => (
          <section key={team.id} className="team-item">
            <span>{team.name}</span>
            <button onClick={() => navigate(`/team/${team.id}/stats`)}>View Stats</button>
            <button onClick={() => navigate(`/team/${team.id}/players`)}>Manage Players</button>
          </section>
        ))}
      </section>
    </section>
  );
};

export default MyTeamTab;
