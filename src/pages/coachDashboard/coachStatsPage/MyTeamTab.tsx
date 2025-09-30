// src/pages/coachDashboard/MyTeamTab.tsx

import React, { useState, useEffect } from 'react';
import type { Match, Player } from '../../../types';
import { calculateTeamStats } from './team-stats-helper';
import { fetchTeamMatches } from '../../../services/matchService';
import { fetchPlayersWithStats } from '../../../services/playerService';
import { useTeamData } from '../hooks/useTeamData';
import { getCurrentTeamId } from '../../../services/teamService';
import PlayerStatsModal from '../playerManagement/PlayerStatsModal.tsx';
import TeamStatsReport from '../../components/teamStatsReport.tsx';


const MyTeamTab: React.FC = () => {
  const { team, isLoading: teamLoading, error: teamError } = useTeamData();
  const currentTeamId = getCurrentTeamId();
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch matches and players from database
  useEffect(() => {
    const loadData = async () => {
      if (!team || !currentTeamId) return;
      
      try {
        setIsLoading(true);
        
        // Load matches
        const teamMatches = await fetchTeamMatches(team.id);
        setMatches(teamMatches);
        
        // Load players with stats
        const playersWithStats = await fetchPlayersWithStats(currentTeamId);
        setPlayers(playersWithStats);
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load team data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [team, currentTeamId]);

  const stats = calculateTeamStats(matches);


  const handlePlayerSelect = (playerId: string) => {
    if (playerId === '') {
      setSelectedPlayer(null);
      return;
    }
    
    const player = players.find(p => p.id === playerId);
    if (player) {
      setSelectedPlayer(player);
    }
  };

  if (teamLoading) {
    return <div className="loading">Loading team data...</div>;
  }

  if (teamError) {
    return <div className="error">{teamError}</div>;
  }

  if (isLoading) {
    return <div className="loading">Loading team stats...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!team || !stats) {
    return <div className="error">No team data available.</div>;
  }

  return (
    <section className="team-stats-container">
      


      {/* Player Stats Modal */}
      {selectedPlayer && (
        <PlayerStatsModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}

      <TeamStatsReport
  team={team}
  matches={matches}
  stats={stats}
  players={players}
  selectedPlayer={selectedPlayer}
  onPlayerSelect={handlePlayerSelect}
  showPlayerSelector
/>

    </section>
  );
};

export default MyTeamTab;