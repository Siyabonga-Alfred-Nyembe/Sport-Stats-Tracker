// src/components/Matches/MatchDetailsModal.tsx

import React, { useState } from 'react';

export interface Team {
  id: string;
  name: string;
  coachId: string;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  minutesPlayed: number;
  yellowCards: number;
  redCards: number;
}

export interface Player {
    
  id: string;
  jerseyNum: string;
  name: string;
  teamId: string;
  position: string;
  stats: PlayerStats;
  imageUrl: string; // Added for the player card
}

export interface MatchEvent {
  id: string;
  matchId: string;
  playerId: string;
  eventType: 'goal' | 'assist' | 'yellow_card' | 'red_card';
  minute?: number; // Optional: The minute the event occurred
}

// The main Match object, now with team-level stats
export interface Match {
  id: string;
  teamId: string; // Your team's ID
  opponentName: string;
  teamScore: number;
  opponentScore: number;
  date: string;
  status: 'scheduled' | 'completed';
  
  // Team-level stats
  possession?: number; // Your team's possession %
  shots?: number;
  shotsOnTarget?: number;
}





















interface Props {
  match: Match;
  players: Player[];
  events: MatchEvent[];
  onClose: () => void;
  onUpdateTeamStats: (matchId: string, stats: Partial<Match>) => void;
  onAddPlayerEvent: (eventId: string, matchId: string, playerId: string, eventType: MatchEvent['eventType']) => void;
  onRemovePlayerEvent: (eventId: string) => void;
}

const MatchDetailsModal: React.FC<Props> = ({ match, players, events, onClose, onUpdateTeamStats, onAddPlayerEvent, onRemovePlayerEvent }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

  const handleAddEvent = (eventType: MatchEvent['eventType']) => {
    if (!selectedPlayerId) return;
    const eventId = `evt-${Date.now()}`;
    onAddPlayerEvent(eventId, match.id, selectedPlayerId, eventType);
  };
  
  const getPlayerName = (playerId: string) => players.find(p => p.id === playerId)?.name || 'Unknown Player';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="section-title">Match Details</h2>
        <h3>{players[0]?.teamId} vs {match.opponentName} ({match.teamScore} - {match.opponentScore})</h3>

        {/* --- Player Events Section --- */}
        <section className="stat-section">
          <h4>Player Events</h4>
          <div className="event-form">
            <select value={selectedPlayerId} onChange={e => setSelectedPlayerId(e.target.value)}>
              <option value="">Select Player...</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name} (#{p.jerseyNum})</option>)}
            </select>
            <div className="event-buttons">
              <button onClick={() => handleAddEvent('goal')} disabled={!selectedPlayerId}>Goal ⚽</button>
              <button onClick={() => handleAddEvent('assist')} disabled={!selectedPlayerId}>Assist 👟</button>
              <button onClick={() => handleAddEvent('yellow_card')} className="yellow" disabled={!selectedPlayerId}>Yellow Card 🟨</button>
              <button onClick={() => handleAddEvent('red_card')} className="red" disabled={!selectedPlayerId}>Red Card 🟥</button>
            </div>
          </div>
          <ul className="event-list">
            {events.map(event => (
              <li key={event.id}>
                <span>{event.eventType.replace('_', ' ')}: <strong>{getPlayerName(event.playerId)}</strong></span>
                <button onClick={() => onRemovePlayerEvent(event.id)}>&times;</button>
              </li>
            ))}
          </ul>
        </section>
        
        {/* --- Team Stats Section --- */}
        <section className="stat-section">
          <h4>Team Stats</h4>
          <div className="team-stats-form">
            <label>Possession (%)</label>
            <input 
              type="number" 
              defaultValue={match.possession}
              onBlur={(e) => onUpdateTeamStats(match.id, { possession: Number(e.target.value) })}
            />
            <label>Total Shots</label>
            <input 
              type="number"
              defaultValue={match.shots}
              onBlur={(e) => onUpdateTeamStats(match.id, { shots: Number(e.target.value) })}
            />
            <label>Shots on Target</label>
            <input 
              type="number"
              defaultValue={match.shotsOnTarget}
              onBlur={(e) => onUpdateTeamStats(match.id, { shotsOnTarget: Number(e.target.value) })}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default MatchDetailsModal;