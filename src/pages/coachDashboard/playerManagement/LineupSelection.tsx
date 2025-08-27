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


const LineupSelection: React.FC<Props> = ({ lineup, onRemoveFromLineup }) => {
  return (
    <section className="management-section lineup-section">
      <h2 className="section-title">Starting Lineup</h2>
      {lineup.length === 0 ? (
        <p className="empty-message">Add players from the roster to build your lineup.</p>
      ) : (
        <div className="card-grid">
          {lineup.map(player => (
            <PlayerCard jerseyNum={player.jerseyNum} key={player.id} name={player.name} position={player.position} imageUrl={player.imageUrl}>
              <button onClick={() => onRemoveFromLineup(player.id)} className="remove-btn">
                Remove from Lineup
              </button>
            </PlayerCard>
          ))}
        </div>
      )}
    </section>
  );
};

export default LineupSelection;