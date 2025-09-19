// src/pages/fanDashboard/TeamStatsPage.tsx
import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamData } from "../coachDashboard/hooks/useTeamData";
import { fetchTeamMatches } from "../../services/matchService";
import { calculateTeamStats } from "../coachDashboard/coachStatsPage/team-stats-helper";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TeamStatsReport from "../components/teamStatsReport";
import type {Match} from "../../types"


const TeamStatsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const { team, isLoading, error } = useTeamData();
  const reportRef = useRef<HTMLElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  React.useEffect(() => {
    if (!teamId) return;
    const loadData = async () => {
      const teamMatches = await fetchTeamMatches(teamId);
      setMatches(teamMatches);
    };
    loadData();
  }, [teamId]);

  const stats = calculateTeamStats(matches);

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

  if (isLoading) return <p>Loading team stats...</p>;
  if (error || !team) return <p>Error loading team stats.</p>;

  return (
    <main className="team-stats-container">
        <TeamStatsReport
  team={team}
  matches={matches}
  stats={stats}
  showBackButton
  onBack={() => navigate(-1)}
/>

    </main>
  );
};

export default TeamStatsPage;
