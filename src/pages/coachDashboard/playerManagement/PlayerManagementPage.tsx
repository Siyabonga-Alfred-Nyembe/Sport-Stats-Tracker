
// src/components/PlayerManagement/PlayerManagementPage.tsx

import React, { useEffect, useState } from 'react';
import supabase from '../../../../supabaseClient';

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

// Data will be read from Supabase



const PlayerManagementPage: React.FC = () => {
  // This would come from user authentication state in a real app
  const currentTeamId = 'kaizer_chiefs'; // Coach's current team

  const [players, setPlayers] = useState<Player[]>([]);
  const [lineup, setLineup] = useState<Player[]>([]);

  useEffect(() => {
    const loadPlayers = async () => {
      const { data } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', currentTeamId)
        .order('name');
      if (data) {
        const mapped: Player[] = data.map((p: any) => ({
          id: String(p.id),
          jerseyNum: String(p.jersey_num ?? ''),
          name: p.name,
          teamId: p.team_id,
          position: p.position ?? '',
          stats: { goals: 0, assists: 0, minutesPlayed: 0, yellowCards: 0, redCards: 0 },
          imageUrl: p.image_url ?? `https://via.placeholder.com/280x250/8a2be2/FFF?text=${encodeURIComponent(p.name)}`,
        }));
        setPlayers(mapped);
      }
    };
    loadPlayers();
  }, [currentTeamId]);

  const handleAddPlayer = async (newPlayerData: Omit<Player, 'id' | 'stats' | 'imageUrl' | 'teamId'>) => {
    const payload = {
      name: newPlayerData.name,
      position: newPlayerData.position,
      jersey_num: newPlayerData.jerseyNum,
      team_id: currentTeamId,
      image_url: `https://via.placeholder.com/280x250/8a2be2/FFF?text=${encodeURIComponent(newPlayerData.name)}`,
    };
    const { data, error } = await supabase.from('players').insert(payload).select().single();
    if (!error && data) {
      const saved: Player = {
        id: String(data.id),
        jerseyNum: String(data.jersey_num ?? ''),
        name: data.name,
        teamId: data.team_id,
        position: data.position ?? '',
        stats: { goals: 0, assists: 0, minutesPlayed: 0, yellowCards: 0, redCards: 0 },
        imageUrl: data.image_url,
      };
      setPlayers(prev => [...prev, saved]);
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    setLineup(prev => prev.filter(p => p.id !== playerId));
    setPlayers(prev => prev.filter(p => p.id !== playerId));
    await supabase.from('players').delete().eq('id', playerId);
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
