// src/components/PlayerManagement/LineupSelection.tsx

import React from 'react';
import PlayerCard from '../../components/playerCard';
export interface Player {
  id: string;
  name: string;
  jerseyNum: string;
  teamId: string;
  position: string;
  stats: PlayerStats;
  imageUrl: string; // Added for the player card
}
export interface PlayerStats {
  goals: number;
  assists: number;
  minutesPlayed: number;
  yellowCards: number;
  redCards: number;
}

interface Props {
  lineup: Player[];
  onRemoveFromLineup: (playerId: string) => void;
}

// Helper function to get field position based on player position
const getFieldPosition = (position: string) => {
  const positionMap: { [key: string]: string } = {
    'GK': 'goalkeeper',
    'CB': 'defender',
    'LB': 'defender',
    'RB': 'defender',
    'LWB': 'defender',
    'RWB': 'defender',
    'CDM': 'midfielder',
    'CM': 'midfielder',
    'CAM': 'midfielder',
    'LM': 'midfielder',
    'RM': 'midfielder',
    'LW': 'forward',
    'RW': 'forward',
    'ST': 'forward',
    'CF': 'forward'
  };
  return positionMap[position.toUpperCase()] || 'midfielder';
};

const LineupSelection: React.FC<Props> = ({ lineup, onRemoveFromLineup }) => {
  // Group players by their field position
  const goalkeepers = lineup.filter(p => getFieldPosition(p.position) === 'goalkeeper');
  const defenders = lineup.filter(p => getFieldPosition(p.position) === 'defender');
  const midfielders = lineup.filter(p => getFieldPosition(p.position) === 'midfielder');
  const forwards = lineup.filter(p => getFieldPosition(p.position) === 'forward');

  return (
    <section className="management-section lineup-section">
      <h2 className="section-title">Starting Lineup</h2>
      {lineup.length === 0 ? (
        <p className="empty-message">Add players from the roster to build your lineup.</p>
      ) : (
        <div className="soccer-field">
          <div className="field-container">
            {/* Field background */}
            <div className="field-background">
              <div className="center-circle"></div>
              <div className="center-line"></div>
              <div className="penalty-area-left"></div>
              <div className="penalty-area-right"></div>
              <div className="goal-area-left"></div>
              <div className="goal-area-right"></div>
            </div>
            
            {/* Players positioned on field */}
            <div className="field-positions">
              {/* Goalkeeper */}
              <div className="position-row goalkeeper-row">
                {goalkeepers.map(player => (
                  <div key={player.id} className="player-position goalkeeper">
                    <div className="player-marker">
                      <span className="jersey-number">{player.jerseyNum}</span>
                      <span className="player-name">{player.name}</span>
                      <button 
                        onClick={() => onRemoveFromLineup(player.id)} 
                        className="remove-player-btn"
                        title="Remove from lineup"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Defenders */}
              <div className="position-row defenders-row">
                {defenders.map(player => (
                  <div key={player.id} className="player-position defender">
                    <div className="player-marker">
                      <span className="jersey-number">{player.jerseyNum}</span>
                      <span className="player-name">{player.name}</span>
                      <button 
                        onClick={() => onRemoveFromLineup(player.id)} 
                        className="remove-player-btn"
                        title="Remove from lineup"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Midfielders */}
              <div className="position-row midfielders-row">
                {midfielders.map(player => (
                  <div key={player.id} className="player-position midfielder">
                    <div className="player-marker">
                      <span className="jersey-number">{player.jerseyNum}</span>
                      <span className="player-name">{player.name}</span>
                      <button 
                        onClick={() => onRemoveFromLineup(player.id)} 
                        className="remove-player-btn"
                        title="Remove from lineup"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Forwards */}
              <div className="position-row forwards-row">
                {forwards.map(player => (
                  <div key={player.id} className="player-position forward">
                    <div className="player-marker">
                      <span className="jersey-number">{player.jerseyNum}</span>
                      <span className="player-name">{player.name}</span>
                      <button 
                        onClick={() => onRemoveFromLineup(player.id)} 
                        className="remove-player-btn"
                        title="Remove from lineup"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Formation display */}
          <div className="formation-display">
            <h3>Formation: {defenders.length}-{midfielders.length}-{forwards.length}</h3>
            <p>Total Players: {lineup.length}/11</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default LineupSelection;