import React, { useState } from 'react';
import { createTeam } from '../services/teamService';
import { useNavigate } from 'react-router-dom';
import InlineAlert from './components/InlineAlert';

const TeamSetup: React.FC = () => {
  const [teamName, setTeamName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setSaving(true);
    const team = await createTeam(teamName.trim(), logoFile);
    setSaving(false);
    if (team) {
      setErrorMsg(null);
      navigate('/coach-dashboard');
    } else {
      setErrorMsg('We could not create your team right now. Please check your internet and try again.');
    }
  };

  return (
    <main className="auth-container" style={{ maxWidth: 520, margin: '40px auto' }}>
      <h2>Create your team</h2>
      <InlineAlert message={errorMsg} onClose={() => setErrorMsg(null)} tone="error" />
      <form onSubmit={handleSubmit} className="add-player-form">
        <label style={{ fontWeight: 600, marginBottom: 4 }}>Enter team name</label>
        <input
          type="text"
          placeholder="e.g. Kaizer Chiefs"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />
        <label style={{ fontWeight: 600, margin: '12px 0 4px' }}>Upload team logo (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
        />
        <small style={{ opacity: 0.8, marginTop: 4 }}>If logo upload fails (bucket missing), the team will be created without a logo.</small>
        <button type="submit" disabled={saving} style={{ marginTop: 16 }}>{saving ? 'Saving...' : 'Create Team'}</button>
      </form>
    </main>
  );
};

export default TeamSetup;


