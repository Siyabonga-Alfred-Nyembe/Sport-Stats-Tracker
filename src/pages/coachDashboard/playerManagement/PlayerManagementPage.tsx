
// src/components/PlayerManagement/PlayerManagementPage.tsx

import React, { useState } from 'react';

import RosterManagement from './RosterManagement';
import LineupSelection from './LineupSelection';
import './PlayerManagement.css';

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

const mockTeams: Team[] = [
  { id: 'team1', name: 'Red Lions', coachId: 'c1' },
  { id: 'team2', name: 'Blue Sharks', coachId: 'c2' },
];

const mockPlayers: Player[] = [
  {
    id: 'p1',
    name: 'Leo Vega',
    jerseyNum: "10",
    teamId: 'team1',
    position: 'Striker',
    stats: { goals: 2, assists: 1, minutesPlayed: 90, yellowCards: 0, redCards: 0 },
    imageUrl: 'https://via.placeholder.com/280x250/8a2be2/FFF?text=Leo+Vega',
  },
  {
    id: 'p2',
    name: 'Mia Chen',
    jerseyNum: "10",
    teamId: 'team1',
    position: 'Midfielder',
    stats: { goals: 0, assists: 3, minutesPlayed: 90, yellowCards: 1, redCards: 0 },
    imageUrl: 'https://via.placeholder.com/280x250/333/FFF?text=Mia+Chen',
  },
  {
    id: 'p3',
    name: 'Sam Jones',
    jerseyNum: "10",
    teamId: 'team2',
    position: 'Defender',
    stats: { goals: 0, assists: 0, minutesPlayed: 75, yellowCards: 0, redCards: 0 },
    imageUrl: 'https://via.placeholder.com/280x250/555/FFF?text=Sam+Jones',
  },
];



const PlayerManagementPage: React.FC = () => {
  // This would come from user authentication state in a real app
  const currentTeamId = 'team1'; // Coach's current team

  const [players, setPlayers] = useState<Player[]>(mockPlayers.filter(p => p.teamId === currentTeamId));
  const [lineup, setLineup] = useState<Player[]>([]);

  const handleAddPlayer = (newPlayerData: Omit<Player, 'id' | 'stats' | 'imageUrl' | 'teamId'>) => {
    const player: Player = {
      id: Date.now().toString(),
      ...newPlayerData,
      teamId: currentTeamId, // Automatically assign the coach's teamId here
      stats: { goals: 0, assists: 0, minutesPlayed: 0, yellowCards: 0, redCards: 0 },
      imageUrl: `https://via.placeholder.com/280x250/8a2be2/FFF?text=${newPlayerData.name.replace(' ', '+')}`,
    };
    setPlayers(prev => [...prev, player]);
  };

  const handleRemovePlayer = (playerId: string) => {
    setLineup(prev => prev.filter(p => p.id !== playerId));
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const handleAddToLineup = (player: Player) => {
    if (!lineup.find(p => p.id === player.id)) {
      setLineup(prev => [...prev, player]);
    }
  };

  const handleRemoveFromLineup = (playerId: string) => {
    setLineup(prev => prev.filter(p => p.id !== playerId));
  };

  return (
    <main className="management-container">
      <RosterManagement
        players={players}
        lineupIds={new Set(lineup.map(p => p.id))}
        onAddPlayer={handleAddPlayer}
        onRemovePlayer={handleRemovePlayer}
        onAddToLineup={handleAddToLineup}
        // The 'teams' prop is no longer passed down
      />
      <LineupSelection
        lineup={lineup}
        onRemoveFromLineup={handleRemoveFromLineup}
      />
    </main>
  );
};

export default PlayerManagementPage;

// ✅ Mock data
