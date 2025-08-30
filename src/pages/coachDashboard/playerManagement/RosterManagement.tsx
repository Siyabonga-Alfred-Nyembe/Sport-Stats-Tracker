import React, { useState } from 'react';
import type { Player } from '../../../types'; // Ensure this path is correct for your project
import PlayerCard from '../../components/playerCard';




interface Props {
  players: Player[];
  lineupIds: Set<string>;
  onAddPlayer: (player: Omit<Player, 'id' | 'stats' | 'imageUrl' | 'teamId'>) => void;
  onRemovePlayer: (playerId: string) => void;
  onAddToLineup: (player: Player) => void;
  onPlayerClick: (player: Player) => void; // New prop to handle clicks
}

const RosterManagement: React.FC<Props> = ({ 
  players, 
  lineupIds, 
  onAddPlayer, 
  onRemovePlayer, 
  onAddToLineup, 
  onPlayerClick // Destructure the new prop
}) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [jerseyNum, setJerseyNum] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position.trim() || !jerseyNum.trim()) return;
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
        <button type="submit">Add Player</button>
      </form>

      <div className="card-grid">
        {players.map(player => (
          // --- UPDATED SECTION ---
          // Wrapped the PlayerCard in a div to make the entire card clickable
          <div 
            key={player.id} 
            className="player-card-wrapper" 
            onClick={() => onPlayerClick(player)}
          >
            <PlayerCard 
              name={player.name} 
              position={player.position} 
              jerseyNum={player.jerseyNum} 
              imageUrl={player.imageUrl}
            >
              <button
                onClick={(e) => { e.stopPropagation(); onAddToLineup(player); }} // Stop propagation to prevent modal open
                disabled={lineupIds.has(player.id)}
              >
                Add to Lineup
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onRemovePlayer(player.id); }} // Stop propagation here too
                className="remove-btn"
              >
                Remove
              </button>
            </PlayerCard>
          </div>
          // --- END OF UPDATED SECTION ---
        ))}
      </div>
    </section>
  );
};

export default RosterManagement;