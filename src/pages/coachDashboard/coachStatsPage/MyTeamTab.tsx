// src/pages/coachDashboard/MyTeamTab.tsx

import React, { useState, useRef, useEffect } from 'react';
import type { Match, Player } from '../../../types';
import { calculateTeamStats } from './team-stats-helper';
import { fetchTeamMatches } from '../../../services/matchService';
import { fetchPlayersWithStats } from '../../../services/playerService';
import { useTeamData } from '../hooks/useTeamData';
import { getCurrentTeamId } from '../../../services/teamService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import StatCard from './StatCard';
import TeamPerformanceChart from './TeamPerformanceChart.tsx';
import TeamFormGuide from './TeamFormGuide.tsx';
import PlayerStatsModal from '../playerManagement/PlayerStatsModal.tsx';
import TeamShotsChart from "./Charts/TeamShotsChart";
import BarChart from "./Charts/BarChart.tsx";
import PiChart from "./Charts/PiChart.tsx";
import TeamStatsReport from '../../components/teamStatsReport.tsx';


const MyTeamTab: React.FC = () => {
  const { team, isLoading: teamLoading, error: teamError } = useTeamData();
  const currentTeamId = getCurrentTeamId();
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
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

  const filteredMatches = matches.filter(match => {
    if (startDate && new Date(match.date) < new Date(startDate)) {
      return false;
    }
    if (endDate && new Date(match.date) > new Date(endDate)) {
      return false;
    }
    return true;
  });

  const stats = calculateTeamStats(filteredMatches);

  const handleExportPdf = async () => {
    const contentToCapture = reportRef.current;
    if (!contentToCapture) return;
    setIsExporting(true);
    
    try {
      // Using the robust, element-by-element capture method
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageMargin = 15;
      const pdfWidth = pdf.internal.pageSize.getWidth() - (pageMargin * 2);
      let yPosition = pageMargin;

      const addElementToPdf = async (element: HTMLElement) => {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        if (yPosition + imgHeight > pdf.internal.pageSize.getHeight() - pageMargin) {
          pdf.addPage();
          yPosition = pageMargin;
        }
        pdf.addImage(imgData, 'PNG', pageMargin, yPosition, pdfWidth, imgHeight);
        yPosition += imgHeight + 5; // Add 5mm space after each element
      };

      const elementsToCapture = contentToCapture.querySelectorAll<HTMLElement>('.pdf-capture');
      for (const element of Array.from(elementsToCapture)) {
        await addElementToPdf(element);
      }

      pdf.save(`${team?.name || 'Team'}_Season_Report.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      setError('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

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
        matches={filteredMatches}
        stats={stats}
        players={players}
        selectedPlayer={selectedPlayer}
        onPlayerSelect={handlePlayerSelect}
        showPlayerSelector
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

    </section>
  );
};

export default MyTeamTab;