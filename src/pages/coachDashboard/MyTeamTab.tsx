import React, { useEffect, useState } from "react";
import { fetchTeamById, getCurrentTeamId } from "../../services/teamService";

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
  const [teamName, setTeamName] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const currentId = getCurrentTeamId();
      if (!currentId) return;
      const team = await fetchTeamById(currentId);
      if (team) {
        setTeamName(team.name);
        setLogoUrl(team.logo_url ?? null);
      }
    };
    load();
  }, []);

  return (
    <section className="tab-content">
      <h2>My Team</h2>
      {!teamName ? (
        <section className="form-section">
          <p>No team set up yet.</p>
          <button onClick={() => navigate('/team-setup')}>Create your team</button>
        </section>
      ) : (
        <section className="teams-list">
          <section className="team-item" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {logoUrl && <img src={logoUrl} alt="Team logo" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <strong>{teamName}</strong>
              <span>Team ID: {getCurrentTeamId()}</span>
            </div>
          </section>
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button onClick={() => navigate('/team-setup')}>Edit team</button>
            <button onClick={() => navigate('/coach-dashboard')}>Go to Dashboard</button>
          </div>
        </section>
      )}
    </section>
  );
};

export default MyTeamTab;
