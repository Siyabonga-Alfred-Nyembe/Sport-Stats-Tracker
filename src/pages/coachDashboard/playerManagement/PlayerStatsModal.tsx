// src/components/PlayerManagement/PlayerStatsModal.tsx

import React, { useRef, useState } from 'react'; // Add useState
import type { Player } from '../../../types';
import KeyStatCard from './KeyStatCard';
import StatsChart from './StatsChart';
import StatsTable from './StatsTable';
import { getPlayerKeyStats } from './stats-helper';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './PlayerStatsModal.css';

interface Props {
  player: Player;
  onClose: () => void;
}

const PlayerStatsModal: React.FC<Props> = ({ player, onClose }) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const { keyStats, chartStat } = getPlayerKeyStats(player);
  
  // New state to provide user feedback during the export
  const [isExporting, setIsExporting] = useState(false);

  // --- NEW, ROBUST handleExportPdf FUNCTION ---
   const handleExportPdf = async () => {
    const contentToCapture = modalContentRef.current;
    if (!contentToCapture) return;

    setIsExporting(true);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageMargin = 15;
    const pdfWidth = pdf.internal.pageSize.getWidth() - (pageMargin * 2);
    const usablePageHeight = pdf.internal.pageSize.getHeight() - (pageMargin * 2);
    let yPosition = pageMargin;

    // --- LAYOUT FIX: Find the table to modify its style ---
    const statsTable = contentToCapture.querySelector<HTMLElement>('.stats-table');
    const originalColumns = statsTable ? statsTable.style.gridTemplateColumns : '';

    try {
      // Temporarily force a single-column layout for accurate capture
      if (statsTable) {
        statsTable.style.gridTemplateColumns = '1fr';
      }

      // Helper function to capture an element and add it to the PDF
      const addElementToPdf = async (element: HTMLElement) => {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        if (yPosition + imgHeight > usablePageHeight + pageMargin) {
          pdf.addPage();
          yPosition = pageMargin;
        }

        pdf.addImage(imgData, 'PNG', pageMargin, yPosition, pdfWidth, imgHeight);
        yPosition += imgHeight;
      };

      // --- Process elements one by one ---
      const header = contentToCapture.querySelector<HTMLElement>('.modal-header');
      if (header) await addElementToPdf(header);
      
      const keyStatsGrid = contentToCapture.querySelector<HTMLElement>('.key-stats-grid');
      if (keyStatsGrid) { yPosition += 5; await addElementToPdf(keyStatsGrid); }
      
      const chart = contentToCapture.querySelector<HTMLElement>('.chart-container');
      if (chart) { yPosition += 5; await addElementToPdf(chart); }
      
      const fullStatsSection = contentToCapture.querySelector<HTMLElement>('.full-stats-section');
      if (fullStatsSection) {
        yPosition += 5;
        const title = fullStatsSection.querySelector<HTMLElement>('h3');
        const rows = fullStatsSection.querySelectorAll<HTMLElement>('.stat-row');
        
        if (title) await addElementToPdf(title);
        
        for (const row of Array.from(rows)) {
          await addElementToPdf(row);
        }
      }

      pdf.save(`${player.name}_stats.pdf`);

    } finally {
      // --- IMPORTANT: Restore the original layout after capture is complete ---
      if (statsTable) {
        statsTable.style.gridTemplateColumns = originalColumns;
      }
      setIsExporting(false);
    }
  };

  return (
    <div className="stats-modal-overlay" onClick={onClose}>
      <div className="stats-modal-content" ref={modalContentRef} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <header className="modal-header">
          <img src={player.imageUrl} alt={player.name} className="player-avatar" />
          <div className="player-info">
            <h1>{player.name}</h1>
            <p>{player.position} | #{player.jerseyNum}</p>
          </div>
          {/* Update button to show loading state */}
          <button 
            className="rs-btn export-btn" 
            onClick={handleExportPdf} 
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </header>
        
        <section className="key-stats-grid">
          {keyStats.map(stat => (
            <KeyStatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </section>
        
        <section className="rs-card chart-container">
          <h3>{chartStat.label} over Last 5 Matches</h3>
          <StatsChart data={player.stats.performanceData} />
        </section>

        {/* Add a wrapper class for easier selection */}
        <section className="rs-card full-stats-section">
          <h3>Full Statistics</h3>
          <StatsTable stats={player.stats} />
        </section>
      </div>
    </div>
  );
};

export default PlayerStatsModal;