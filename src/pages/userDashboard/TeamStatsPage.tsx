// src/pages/userDashboard/TeamStatsPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTeamById } from "../../services/teamService";
import { fetchTeamMatches } from "../../services/matchService";
import { calculateTeamStats } from "../coachDashboard/coachStatsPage/team-stats-helper";
import TeamStatsReport from "../components/teamStatsReport";
import type { Match, Team } from "../../types";

const TeamStatsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_isExporting, _setIsExporting] = useState(false);

  useEffect(() => {
    if (!teamId) {
      setError('No team ID provided');
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch team data and matches in parallel
        const [teamData, teamMatches] = await Promise.all([
          fetchTeamById(teamId),
          fetchTeamMatches(teamId)
        ]);

        if (!teamData) {
          setError('Team not found');
          return;
        }

        setTeam({
          id: teamData.id,
          name: teamData.name,
          coachId: teamData.coach_id || 'unknown'
        });
        setMatches(teamMatches);
      } catch (err) {
        console.error('Error loading team data:', err);
        setError('Failed to load team data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [teamId]);

  const stats = calculateTeamStats(matches);

  if (isLoading) return <p>Loading team stats...</p>;
  if (error || !team) return <p>Error loading team stats: {error}</p>;

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
