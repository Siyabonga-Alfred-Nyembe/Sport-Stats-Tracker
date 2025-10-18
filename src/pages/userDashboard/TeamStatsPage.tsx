// src/pages/fanDashboard/TeamStatsPage.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamData } from "../coachDashboard/hooks/useTeamData";
import { fetchTeamMatches } from "../../services/matchService";
import { calculateTeamStats } from "../coachDashboard/coachStatsPage/team-stats-helper";
import TeamStatsReport from "../components/teamStatsReport";
import type {Match} from "../../types"


const TeamStatsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const { team, isLoading, error } = useTeamData();
  const [_isExporting, _setIsExporting] = useState(false);

  React.useEffect(() => {
    if (!teamId) return;
    const loadData = async () => {
      const teamMatches = await fetchTeamMatches(teamId);
      setMatches(teamMatches);
    };
    loadData();
  }, [teamId]);

  const stats = calculateTeamStats(matches);


  if (isLoading) return <p>Loading team stats...</p>;
  if (error || !team) return <p>Error loading team stats.</p>;

  return (
    <main className="team-stats-container">
        <TeamStatsReport
        team={team}
        matches={matches}
        stats={stats}
        showBackButton
        onBack={() => navigate(-1)} startDate={""} endDate={""} setStartDate={function (_date: string): void {
          throw new Error("Function not implemented.");
        } } setEndDate={function (_date: string): void {
          throw new Error("Function not implemented.");
        } } totalInterceptions={0} totalClearances={0} totalYellowCards={0} totalRedCards={0}/>

    </main>
  );
};

export default TeamStatsPage;
