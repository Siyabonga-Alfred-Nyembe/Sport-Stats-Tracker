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
          <p className="stats-summary">Based on {stats.totalMatches} matches</p>
        </section>

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
        <section className="rs-card pdf-capture">
          <h2>Team Performance Averages</h2>
          <ul>
            <li><strong>Avg. Possession:</strong> {stats.avgPossession}%</li>
            <li><strong>Avg. Shots:</strong> {stats.avgShots}</li>
            <li><strong>Avg. Shots on Target:</strong> {stats.avgShotsOnTarget}</li>
            <li><strong>Avg. Fouls:</strong> {stats.avgFouls}</li>
            <li><strong>Avg. Corners:</strong> {stats.avgCorners}</li>
            <li><strong>Avg. Passes:</strong> {stats.avgPasses}</li>
            <li><strong>Avg. Pass Accuracy:</strong> {stats.avgPassAccuracy}%</li>
            <li><strong>Avg. Tackles:</strong> {stats.avgTackles}</li>
            <li><strong>Avg. Saves:</strong> {stats.avgSaves}</li>
          </ul>
        </section>

        <section className="rs-stats pdf-capture">
          <h2>General</h2>
          <StatCard label="Matches Played" value={stats.totalMatches} />
          <BarChart title="Goals" label={["Goals For","Goals Against","Goal Difference"]} values={[stats.goalsFor, stats.goalsAgainst, stats.goalDifference]} />
          <PiChart title="Results %" label={["Win%","Loss/Draw%"]} values={[stats.winPercentage, 100 - stats.winPercentage]} />
          <PiChart title="Results" label={["Wins","Losses","Draws"]} values={[stats.wins, stats.losses, stats.draws]} />
        </section>

        <section className="rs-stats pdf-capture">
          <h2>Attacking</h2>
          <BarChart title="Shooting" label={["Shots","Shots on Target","Goals"]} values={[stats.totalShots, stats.totalShotsOnTarget, stats.goalsFor]} />
          <PiChart title="Passing" label={["Successful Passes","Unsuccessful Passes"]} values={[Number(stats.avgPassAccuracy), 100 - Number(stats.avgPassAccuracy)]} />
        </section>

        <section className="rs-stats pdf-capture">
          <h2>Defending</h2>
          <BarChart title="General" label={["Tackles","Interceptions","Clearances"]} values={[stats.totalTackles, 50, 16]} />
          <BarChart title="Discipline" label={["Fouls","Yellow Cards","Red Cards"]} values={[13, 9, 1]} />
        </section>

        <section className="rs-card pdf-capture">
          <h2>Recent Form (Last 5)</h2>
          <TeamFormGuide form={stats.form} />
        </section>

        <section className="charts-grid">
          <article className="rs-card pdf-capture">
            <h3>Goals For vs. Against per Match</h3>
            <TeamPerformanceChart matches={matches} />
          </article>

          <article className="rs-card pdf-capture">
            <h3>Shots vs. Shots on Target per Match</h3>
            <TeamShotsChart matches={matches} />
          </article>
        </section>
      </article>
    </main>
  );
};

export default TeamStatsReport;
