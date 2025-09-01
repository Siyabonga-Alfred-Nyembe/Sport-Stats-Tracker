// src/pages/coachDashboard/playerManagement/PlayerManagementPage.tsx

import React, { useEffect, useState } from 'react';
import supabase from '../../../../supabaseClient';
import { getCurrentTeamId } from '../../../services/teamService';
import { fetchPlayersWithStats } from '../../../services/playerService';
import RosterManagement from './RosterManagement';
import LineupSelection from './LineupSelection';
import PlayerStatsModal from './PlayerStatsModal';
import './PlayerManagement.css';

// Import the Player and PlayerStats types from your central types file
import type { Player, PlayerStats } from "../../../types";

const PlayerManagementPage: React.FC = () => {
  const currentTeamId = getCurrentTeamId();

  const [players, setPlayers] = useState<Player[]>([]);
  const [lineup, setLineup] = useState<Player[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlayers = async () => {
      if (!currentTeamId) {
        setErrorMsg('No team found. Please set up your team first.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Use the service function that fetches players with real stats from database
        const playersWithStats = await fetchPlayersWithStats(currentTeamId);
        setPlayers(playersWithStats);
        // Removed automatic success notification - only show for user operations
      } catch (error) {
        console.error('Error loading players:', error);
        setErrorMsg('We could not load your players. Please refresh or try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    loadPlayers();
  }, [currentTeamId]);

  const handleAddPlayer = async (newPlayerData: Omit<Player, 'id' | 'stats' | 'imageUrl' | 'teamId'>) => {
    if (!currentTeamId) {
      setErrorMsg('No team found. Please set up your team first.');
      return;
    }

    try {
      const payload = {
        name: newPlayerData.name,
        position: newPlayerData.position,
        jersey_num: newPlayerData.jerseyNum,
        team_id: currentTeamId,
        image_url: `https://via.placeholder.com/280x250/8a2be2/FFF?text=${encodeURIComponent(newPlayerData.name)}`,
      };
      
      const { data, error } = await supabase.from('players').insert(payload).select().single();
      
      if (!error && data) {
        // Create a new player with empty stats (will be populated when they play matches)
        const saved: Player = {
          id: String(data.id),
          jerseyNum: String(data.jersey_num ?? ''),
          name: data.name,
          teamId: data.team_id,
          position: data.position ?? '',
          stats: {
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
            dribblesAttempted: 0,
            dribblesSuccessful: 0,
            offsides: 0,
            yellowCards: 0,
            redCards: 0,
            performanceData: [0, 0, 0, 0, 0],
          },
          imageUrl: data.image_url,
        };
        setPlayers(prev => [...prev, saved]);
      } else if (error) {
        setErrorMsg('We could not add that player. Please try again.');
      }
    } catch (error) {
      console.error('Error adding player:', error);
      setErrorMsg('We could not add that player. Please try again.');
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    try {
      // Remove from lineup first
      setLineup(prev => prev.filter(p => p.id !== playerId));
      
      // Remove from players list
      setPlayers(prev => prev.filter(p => p.id !== playerId));
      
      // Delete from database
      const { error } = await supabase.from('players').delete().eq('id', playerId);
      
      if (error) {
        console.error('Error removing player:', error);
        setErrorMsg('We could not remove that player. Please try again.');
      }
    } catch (error) {
      console.error('Error removing player:', error);
      setErrorMsg('We could not remove that player. Please try again.');
    }
  };

  const handleAddToLineup = (player: Player) => {
    if (!lineup.find(p => p.id === player.id)) {
      setLineup(prev => [...prev, player]);
    }
  };

  const handleRemoveFromLineup = (playerId: string) => {
    setLineup(prev => prev.filter(p => p.id !== playerId));
  };
  
  if (isLoading) {
    return (
      <main className="management-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading players...</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="management-container">
      {errorMsg && (
        <div style={{ 
          background: 'rgba(255, 0, 0, 0.1)', 
          color: 'red', 
          padding: '1rem', 
          margin: '1rem', 
          borderRadius: '8px',
          border: '1px solid red'
        }}>
          {errorMsg}
          <button 
            onClick={() => setErrorMsg(null)}
            style={{ 
              float: 'right', 
              background: 'none', 
              border: 'none', 
              color: 'red', 
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        </div>
      )}
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