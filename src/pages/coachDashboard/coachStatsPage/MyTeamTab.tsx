// src/pages/coachDashboard/MyTeamTab.tsx

import React, { useState, useRef } from 'react';
import type { Match, Team } from '../../../types';
import { mockTeamMatches } from './mockMatchData.ts';
import { calculateTeamStats } from './team-stats-helper';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import StatCard from './StatCard';
import TeamPerformanceChart from './TeamPerformanceChart.tsx';
import TeamFormGuide from './TeamFormGuide.tsx';
import './MyTeamTab.css';

const MyTeamTab: React.FC = () => {
  const [team] = useState<Team>({ id: 'team1', name: 'Cosmic Comets', coachId: 'coach123' });
  const [matches] = useState<Match[]>(mockTeamMatches);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  
  const stats = calculateTeamStats(matches);

  const handleExportPdf = async () => {
    const contentToCapture = reportRef.current;
    if (!contentToCapture) return;
    setIsExporting(true);
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

    pdf.save(`${team.name}_Season_Report.pdf`);
    setIsExporting(false);
  };

  if (!stats) {
    return <div>Loading team stats...</div>;
  }

  return (
    <section className="team-stats-container">
      <header className="stats-header pdf-capture">
        <div className="team-info">
          <h1>{team.name}</h1>
          <p>Season Performance Report</p>
        </div>
        <button className="rs-btn" onClick={handleExportPdf} disabled={isExporting}>
          {isExporting ? 'Exporting...' : 'Export as PDF'}
        </button>
      </header>

      <div className="stats-report" ref={reportRef}>
        <section className="rs-stats pdf-capture">
          <StatCard label="Matches Played" value={stats.totalMatches} />
          <StatCard label="Win %" value={`${stats.winPercentage}%`} />
          <StatCard label="Goals For" value={stats.goalsFor} />
          <StatCard label="Goals Against" value={stats.goalsAgainst} />
          <StatCard label="Goal Difference" value={stats.goalDifference} />
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
             <h3>Average Stats per Match</h3>
              <div className="avg-stats-list">
                <p><strong>Avg. Possession:</strong> {stats.avgPossession}%</p>
                <p><strong>Avg. Shots:</strong> {stats.avgShots}</p>
                <p><strong>Avg. Fouls:</strong> {stats.avgFouls}</p>
              </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default MyTeamTab;