// src/pages/coachDashboard/playerManagement/PlayerManagementPage.tsx

import React, { useEffect, useState } from 'react';
import supabase from '../../../../supabaseClient';
import { getCurrentTeamId } from '../../../services/teamService';
import RosterManagement from './RosterManagement';
import LineupSelection from './LineupSelection';
import PlayerStatsModal from './PlayerStatsModal';
import './PlayerManagement.css';

// 1. Import the Player and PlayerStats types from your central types file
import type { Player, PlayerStats } from "../../../types";

// Helper function to create a default, complete stats object
const createDefaultStats = (): PlayerStats => ({
  goals: 0,
  assists: 0,
  shots: 0,
  shotsOnTarget: 0,
  chancesCreated: 0,
  tackles: 0,
  interceptions: 0,
  clearances: 0,
  saves: 0,
  cleansheets: 0,
  savePercentage: 0,
  passCompletion: 0,
  minutesPlayed: 0,
  yellowCards: 0,
  redCards: 0,
  performanceData: [0, 0, 0, 0, 0],
});

const PlayerManagementPage: React.FC = () => {
  const currentTeamId = getCurrentTeamId() || 'kaizer_chiefs';

  const [players, setPlayers] = useState<Player[]>([]);
  const [lineup, setLineup] = useState<Player[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const loadPlayers = async () => {
      const { data, error } = await supabase
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
          // 2. IMPORTANT: Initialize the FULL stats object here
          stats: createDefaultStats(), // In a real app, you would fetch these stats
          imageUrl: p.image_url ?? `https://via.placeholder.com/280x250/8a2be2/FFF?text=${encodeURIComponent(p.name)}`,
        }));
        setPlayers(mapped);
      } else if (error) {
        setErrorMsg('We could not load your players. Please refresh or try again later.');
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
        // 3. Also initialize the full stats object for new players
        stats: createDefaultStats(),
        imageUrl: data.image_url,
      };
      setPlayers(prev => [...prev, saved]);
    } else if (error) {
      setErrorMsg('We could not add that player. Please try again.');
    }
  };

  const handleRemovePlayer = async (playerId: string) => { /* ... your existing logic ... */ };
  const handleAddToLineup = (player: Player) => { /* ... your existing logic ... */ };
  const handleRemoveFromLineup = (playerId: string) => { /* ... your existing logic ... */ };

  return (
    <main className="management-container">
      {/* <InlineAlert message={errorMsg} onClose={() => setErrorMsg(null)} /> */}
      <RosterManagement
        players={players}
        lineupIds={new Set(lineup.map(p => p.id))}
        onAddPlayer={handleAddPlayer}
        onRemovePlayer={handleRemovePlayer}
        onAddToLineup={handleAddToLineup}
        onPlayerClick={(player) => setSelectedPlayer(player)}
      />
      <LineupSelection
        lineup={lineup}
        onRemoveFromLineup={handleRemoveFromLineup}
      />
      
      {selectedPlayer && (
        <PlayerStatsModal 
          player={selectedPlayer} 
          onClose={() => setSelectedPlayer(null)} 
        />
      )}
    </main>
  );
};

export default PlayerManagementPage;