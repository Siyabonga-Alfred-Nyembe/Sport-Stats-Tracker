// src/components/PlayerManagement/RosterManagement.tsx

import React, { useState } from 'react';
import PlayerCard from '../../components/playerCard';

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

interface Props {
  players: Player[];
  lineupIds: Set<string>;
  // The onAddPlayer prop no longer includes teamId in its argument
  onAddPlayer: (player: Omit<Player, 'id' | 'stats' | 'imageUrl' | 'teamId'>) => void;
  onRemovePlayer: (playerId: string) => void;
  onAddToLineup: (player: Player) => void;
}

const RosterManagement: React.FC<Props> = ({ players, lineupIds, onAddPlayer, onRemovePlayer, onAddToLineup }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [jerseyNum, setJerseyNum] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position.trim() || !jerseyNum.trim()) return;

    // teamId is no longer passed from here
    onAddPlayer({ name, position, jerseyNum });

    setName('');
    setPosition('');
    setJerseyNum('');
  };

  return (
    <section className="management-section">
      <h2 className="section-title">Team Roster</h2>
      <form onSubmit={handleSubmit} className="add-player-form">
        <h3>Add New Player</h3>
        <input type="text" placeholder="Player Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="text" placeholder="Position" value={position} onChange={e => setPosition(e.target.value)} required />
        <input type="number" placeholder="Jersey Number" value={jerseyNum} onChange={e => setJerseyNum(e.target.value)} required />
        
        {/* The team selection dropdown has been removed */}
        
        <button type="submit">Add Player</button>
      </form>

      <div className="card-grid">
        {players.map(player => (
          <PlayerCard 
            key={player.id} 
            name={player.name} 
            position={player.position} 
            jerseyNum={player.jerseyNum} 
            imageUrl={player.imageUrl}
          >
            <button
              onClick={() => onAddToLineup(player)}
              disabled={lineupIds.has(player.id)}
            >
              Add to Lineup
            </button>
            <button onClick={() => onRemovePlayer(player.id)} className="remove-btn">
              Remove
            </button>
          </PlayerCard>
        ))}
      </div>
    </section>
  );
};

export default RosterManagement;