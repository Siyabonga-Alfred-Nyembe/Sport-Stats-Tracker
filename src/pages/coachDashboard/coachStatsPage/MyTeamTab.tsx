// src/pages/coachDashboard/MyTeamTab.tsx

import React, { useState, useRef, useEffect } from 'react';
import type { Match } from '../../../types';
import { calculateTeamStats } from './team-stats-helper';
import { fetchTeamMatches } from '../../../services/matchService';
import { useTeamData } from '../hooks/useTeamData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import StatCard from './StatCard';
import TeamPerformanceChart from './TeamPerformanceChart.tsx';
import TeamFormGuide from './TeamFormGuide.tsx';
import './MyTeamTab.css';
import TeamShotsChart from "./Charts/TeamShotsChart";
import BarChart from "./Charts/BarChart.tsx";
import PiChart from "./Charts/PiChart.tsx";


const MyTeamTab: React.FC = () => {
  const { team, isLoading: teamLoading, error: teamError } = useTeamData();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  
  // Fetch matches from database
  useEffect(() => {
    const loadMatches = async () => {
      if (!team) return;
      
      try {
        setIsLoading(true);
        const teamMatches = await fetchTeamMatches(team.id);
        setMatches(teamMatches);
        // Removed automatic success notification - only show for user operations
      } catch (err) {
        console.error('Error loading matches:', err);
        setError('Failed to load match data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMatches();
  }, [team]);

  const stats = calculateTeamStats(matches);

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
      <header className="stats-header pdf-capture">
        <div className="team-info">
          <h1>{team.name}</h1>
          <p>Performance Report</p>
          <p className="stats-summary">
            Based on {stats.totalMatches} matches
          </p>
        </div>
        <div className="filter-by-date">
      <label htmlFor="start-date">From</label>
      <input type="date" id="start-date" name="start-date" />
      <label htmlFor="end-date">To</label>
      <input type="date" id="end-date" name="end-date" />
      <button className="rs-btn filter-btn">Apply</button>
    </div>
        <button className="rs-btn" onClick={handleExportPdf} disabled={isExporting}>
          {isExporting ? 'Exporting...' : 'Export as PDF'}
        </button>
      </header>

      <section className="rs-card pdf-capture">
            <h3>Team Performance Averages</h3>
            <div className="avg-stats-list">
              <p><strong>Avg. Possession:</strong> {stats.avgPossession}%</p>
              <p><strong>Avg. Shots:</strong> {stats.avgShots}</p>
              <p><strong>Avg. Shots on Target:</strong> {stats.avgShotsOnTarget}</p>
              <p><strong>Avg. Fouls:</strong> {stats.avgFouls}</p>
              <p><strong>Avg. Corners:</strong> {stats.avgCorners}</p>
              <p><strong>Avg. Passes:</strong> {stats.avgPasses}</p>
              <p><strong>Avg. Pass Accuracy:</strong> {stats.avgPassAccuracy}%</p>
              <p><strong>Avg. Tackles:</strong> {stats.avgTackles}</p>
              <p><strong>Avg. Saves:</strong> {stats.avgSaves}</p>
            </div>
          </section>

      <div className="stats-report" ref={reportRef}>
        <h1>General</h1>
        <section className="rs-stats pdf-capture">
          
          <StatCard label="Matches Played" value={stats.totalMatches} />
          <BarChart title="goals" label={["Goals For","Goals Against","Goal Difference"]} values={[stats.goalsFor,stats.goalsAgainst,stats.goalDifference]}/>
          <PiChart title="%" label={["Win%","Loss/Draw%"]} values={[stats.winPercentage,100-stats.winPercentage]}/>
          <PiChart title="games" label={["Wins","Losses","Draws"]} values={[stats.wins,stats.losses,stats.draws]}/>

        </section>

        <h1>Attacking</h1>
        <section className="rs-stats pdf-capture">
      
          <BarChart title="Shooting" label={["Shots","Shots on Target","Goals"]} values={[stats.totalShots,stats.totalShotsOnTarget,stats.goalsFor]}/>
          <PiChart title="Passing" label={["Succesfull Passes","Unsuccessfull Passes"]} values={[Number(stats.avgPassAccuracy),100-Number(stats.avgPassAccuracy)]}/>
          

        </section>
        <h1>Defending</h1>
        <section className="rs-stats pdf-capture">
          {/* Interceptions and clearances are mocks */}
          <BarChart title="General" label={["Tackles","Interceptions","Clearances"]} values={[stats.totalTackles,50,16]}/>
          <BarChart title="Discipline" label={["Fouls","Yellow Cards","Red Cards"]} values={[13,9,1]}/>
          

        </section>
        
        

        <section className="rs-card pdf-capture">
          <h3>Recent Form (Last 5)</h3>
          <TeamFormGuide form={stats.form} />
        </section>


        <div className="charts-grid">
  <section className="rs-card pdf-capture">
    <h3>Goals For vs. Against per Match</h3>
    <TeamPerformanceChart matches={matches} />
  </section>

  <section className="rs-card pdf-capture">
    <h3>Shots vs. Shots on Target per Match</h3>
    <TeamShotsChart matches={matches} />
  </section>
</div>
        
      </div>
    </section>
  );
};

export default MyTeamTab;