// src/components/TeamStatsReport.tsx
import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import StatCard from "../coachDashboard/coachStatsPage/StatCard";
import TeamPerformanceChart from "../coachDashboard/coachStatsPage/TeamPerformanceChart";
import TeamFormGuide from "../coachDashboard/coachStatsPage/TeamFormGuide";
import TeamShotsChart from "../coachDashboard/coachStatsPage/Charts/TeamShotsChart";
import BarChart from "../coachDashboard/coachStatsPage/Charts/BarChart";
import PiChart from "../coachDashboard/coachStatsPage/Charts/PiChart";
import type { Match, Player } from "../../types";
import "./TeamStatsReport.css";

interface Props {
  team: { id: string; name: string };
  matches: Match[];
  stats: any;
  players?: Player[];
  selectedPlayer?: Player | null;
  onPlayerSelect?: (playerId: string) => void;
  showPlayerSelector?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

const TeamStatsReport: React.FC<Props> = ({
  team,
  matches,
  stats,
  players = [],
  selectedPlayer,
  onPlayerSelect,
  showPlayerSelector = false,
  showBackButton = false,
  onBack,
}) => {
  const reportRef = useRef<HTMLElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Early return if stats is null or undefined
  if (!stats) {
    return (
      <main className="team-stats-container">
        <div className="loading">Loading team statistics...</div>
      </main>
    );
  }

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageMargin = 15;
      const pdfWidth = pdf.internal.pageSize.getWidth() - pageMargin * 2;
      let yPosition = pageMargin;

      const addElementToPdf = async (element: HTMLElement) => {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        if (yPosition + imgHeight > pdf.internal.pageSize.getHeight() - pageMargin) {
          pdf.addPage();
          yPosition = pageMargin;
        }
        pdf.addImage(imgData, "PNG", pageMargin, yPosition, pdfWidth, imgHeight);
        yPosition += imgHeight + 5;
      };

      const elementsToCapture = reportRef.current.querySelectorAll<HTMLElement>(".pdf-capture");
      for (const element of Array.from(elementsToCapture)) {
        await addElementToPdf(element);
      }

      pdf.save(`${team?.name || "Team"}_Season_Report.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="team-stats-container">
      
      <header className="stats-header pdf-capture">
        <section>
          <h1>{team.name}</h1>
          <p>Performance Report</p>
          <p className="stats-summary">Based on {stats.totalMatches || 0} matches</p>
        </section>

        <section className="rs-card-sec pdf-capture">
          <h2>Recent Form (Last 5)</h2>
          <TeamFormGuide form={stats.form || []} />
        </section>

        <div className="filter-by-date">
            <label htmlFor="start-date">From</label>
            <input type="date" id="start-date" name="start-date" />
            <label htmlFor="end-date">To</label>
            <input type="date" id="end-date" name="end-date" />
            <button className="rs-btn filter-btn">Apply</button>
          </div>

        <nav className="header-controls">
          {showBackButton && (
            <button className="rs-btn" onClick={onBack}>← Back</button>
          )}
          {showPlayerSelector && (
            <div className="player-selector">
              <label htmlFor="player-select">View Player Stats:</label>
              <select
                id="player-select"
                className="player-dropdown"
                onChange={(e) => onPlayerSelect?.(e.target.value)}
                value={selectedPlayer?.id || ""}
              >
                <option value="">Select a player...</option>
                {players.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} - {player.position}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button className="rs-btn" onClick={handleExportPdf} disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export as PDF"}
          </button>
        </nav>
      </header>

      <article ref={reportRef}>
        <section className="pef-sec">
  <h2>Team Performance Averages</h2>
  <ul>
    <StatCard label="Matches Played" value={stats.totalMatches || 0} />
    <StatCard label="Possession" value={stats.avgPossession || 0} />
    <StatCard label="Shots" value={stats.avgShots || 0} />
    <StatCard label="Shots on Target" value={stats.avgShotsOnTarget || 0} />
    <StatCard label="Fouls" value={stats.avgFouls || 0} />
    <StatCard label="Corners" value={stats.avgCorners || 0} />
    <StatCard label="Passes" value={stats.avgPasses || 0} />
    <StatCard label="Pass Accuracy" value={`${stats.avgPassAccuracy || 0}%`} />
    <StatCard label="Tackles" value={stats.avgTackles || 0} />
    <StatCard label="Saves" value={stats.avgSaves || 0} />
    
  </ul>
</section>


        <section className="rs-stats-sec pdf-capture">
          <h2>General</h2>
          <section className="gen-team-stats">
            <BarChart 
            title="Goals" 
            label={["Goals For","Goals Against","Goal Difference"]} 
            values={[stats.goalsFor || 0, stats.goalsAgainst || 0, stats.goalDifference || 0]} 
          />
          <PiChart 
            title="Results %" 
            label={["Win%","Loss/Draw%"]} 
            values={[stats.winPercentage || 0, 100 - (stats.winPercentage || 0)]} 
          />
          <PiChart 
            title="Results" 
            label={["Wins","Losses","Draws"]} 
            values={[stats.wins || 0, stats.losses || 0, stats.draws || 0]} 
          />
          </section>
          
        </section>
        <section className="def-att">
          <section className="rs-stats-sec pdf-capture">
            <h2>Attacking</h2>
          <section className="att-team-stats">  
          <BarChart 
            title="Shooting" 
            label={["Shots","Shots on Target","Goals"]} 
            values={[stats.totalShots || 0, stats.totalShotsOnTarget || 0, stats.goalsFor || 0]} 
          />
          <PiChart 
            title="Passing" 
            label={["Successful Passes","Unsuccessful Passes"]} 
            values={[Number(stats.avgPassAccuracy) || 0, 100 - (Number(stats.avgPassAccuracy) || 0)]} 
          />
          </section>
          
        </section>

        <section className="rs-stats-sec pdf-capture">
          <h2>Defending</h2>
          <section className="att-team-stats">
            <BarChart 
            title="General" 
            label={["Tackles","Interceptions","Clearances"]} 
            values={[stats.totalTackles || 0, 50, 16]} 
          />
          <BarChart 
            title="Discipline" 
            label={["Fouls","Yellow Cards","Red Cards"]} 
            values={[13, 9, 1]} 
          />
          </section>
          
        </section>
        </section>
        
      </article>
    </main>
  );
};

export default TeamStatsReport;