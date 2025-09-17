import React, { useState } from 'react';
import type { Player } from '../../../types'; // Ensure this path is correct for your project
import PlayerCard from '../../components/playerCard';

interface Props {
  players: Player[];
  lineupIds: Set<string>;
  onAddPlayer: (player: Omit<Player, 'id' | 'stats' | 'imageUrl' | 'teamId'>) => void;
  onRemovePlayer: (playerId: string) => void;
  onAddToLineup: (player: Player) => void;
}

// Helper function to get position category and display name
const getPositionCategory = (position: string) => {
  const positionMap: { [key: string]: { category: string; displayName: string } } = {
    'GK': { category: 'goalkeepers', displayName: 'Goalkeepers' },
    'CB': { category: 'defenders', displayName: 'Defenders' },
    'LB': { category: 'defenders', displayName: 'Defenders' },
    'RB': { category: 'defenders', displayName: 'Defenders' },
    'LWB': { category: 'defenders', displayName: 'Defenders' },
    'RWB': { category: 'defenders', displayName: 'Defenders' },
    'DEF': { category: 'defenders', displayName: 'Defenders' },
    'CDM': { category: 'midfielders', displayName: 'Midfielders' },
    'CM': { category: 'midfielders', displayName: 'Midfielders' },
    'CAM': { category: 'midfielders', displayName: 'Midfielders' },
    'LM': { category: 'midfielders', displayName: 'Midfielders' },
    'RM': { category: 'midfielders', displayName: 'Midfielders' },
    'MID': { category: 'midfielders', displayName: 'Midfielders' },
    'LW': { category: 'forwards', displayName: 'Forwards' },
    'RW': { category: 'forwards', displayName: 'Forwards' },
    'ST': { category: 'forwards', displayName: 'Forwards' },
    'CF': { category: 'forwards', displayName: 'Forwards' },
    'STR': { category: 'forwards', displayName: 'Forwards' }
  };
  return positionMap[position.toUpperCase()] || { category: 'midfielders', displayName: 'Midfielders' };
};

const RosterManagement: React.FC<Props> = ({ 
  players, 
  lineupIds, 
  onAddPlayer, 
  onRemovePlayer, 
  onAddToLineup
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

  // Group players by position category
  const groupedPlayers = players.reduce((acc, player) => {
    const { category } = getPositionCategory(player.position);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(player);
    return acc;
  }, {} as { [key: string]: Player[] });

  // Define the order of position categories
  const positionOrder = ['goalkeepers', 'defenders', 'midfielders', 'forwards'];

  return (
    <section className="management-section">
      <h2 className="section-title">Team Roster</h2>
      <form onSubmit={handleSubmit} className="add-player-form">
        <h3>Add New Player</h3>
        <input type="text" placeholder="Player Name" value={name} onChange={e => setName(e.target.value)} required />
        <select value={position} onChange={e => setPosition(e.target.value)} required>
          <option value="">Select Position</option>
          <optgroup label="Goalkeepers">
            <option value="GK">GK - Goalkeeper</option>
          </optgroup>
          <optgroup label="Defenders">
            <option value="CB">CB - Center Back</option>
            <option value="LB">LB - Left Back</option>
            <option value="RB">RB - Right Back</option>
            <option value="LWB">LWB - Left Wing Back</option>
            <option value="RWB">RWB - Right Wing Back</option>
          </optgroup>
          <optgroup label="Midfielders">
            <option value="CDM">CDM - Defensive Midfielder</option>
            <option value="CM">CM - Center Midfielder</option>
            <option value="CAM">CAM - Attacking Midfielder</option>
            <option value="LM">LM - Left Midfielder</option>
            <option value="RM">RM - Right Midfielder</option>
          </optgroup>
          <optgroup label="Forwards">
            <option value="LW">LW - Left Winger</option>
            <option value="RW">RW - Right Winger</option>
            <option value="ST">ST - Striker</option>
            <option value="CF">CF - Center Forward</option>
          </optgroup>
        </select>
        <input min="0" type="number" placeholder="Jersey Number" value={jerseyNum} onChange={e => setJerseyNum(e.target.value)} required />
        <button type="submit">Add Player</button>
      </form>

      <div className="roster-groups">
        {positionOrder.map(category => {
          const categoryPlayers = groupedPlayers[category];
          if (!categoryPlayers || categoryPlayers.length === 0) return null;
          
          const { displayName } = getPositionCategory(categoryPlayers[0]?.position || '');
          
          return (
            <div key={category} className="position-group">
              <h3 className="position-group-title">{displayName} ({categoryPlayers.length})</h3>
              <div className="card-grid">
                {categoryPlayers.map(player => (
                  <div key={player.id} className="player-card-wrapper">
                    <PlayerCard 
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
                      <button 
                        onClick={() => onRemovePlayer(player.id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </PlayerCard>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RosterManagement;