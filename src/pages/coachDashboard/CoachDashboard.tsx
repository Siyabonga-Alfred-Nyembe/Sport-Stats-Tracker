import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import MyTeamTab from "./MyTeamTab";
// Updated import to use the correct name for clarity
import MatchesPage from "./matchManaging/MatchesPage";
import PlayerManagementPage from "./playerManagement/PlayerManagementPage";
import "../../Styles/dashboard.css";
import { getCurrentTeamId } from "../../services/teamService";
import supabase from "../../../supabaseClient";

// --- NOTE: These interfaces should ideally be in a single, shared types.ts file ---

export interface Team {
  id: string;
  name: string;
  coachId: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  stats: any; // Using 'any' as a placeholder for brevity
  imageUrl: string;
}

// Updated Match interface to match the new structure used in MatchesPage
export interface Match {
  id: string;
  teamId: string; // Your team's ID
  opponentName: string;
  teamScore: number;
  opponentScore: number;
  date: string;
  status: "scheduled" | "completed";
}

const CoachDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("matches"); // Default to matches to see it working
  
  // These states are no longer used by their respective pages but may be used by other tabs.
  const [players, setPlayers] = useState<Player[]>([]); 
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [countPlayers, setCountPlayers] = useState<number>(0);
  const [countTeams, setCountTeams] = useState<number>(0);
  const [countMatches, setCountMatches] = useState<number>(0);

  const handleProfileClick = () => navigate("/profile-settings");
  const handleReportIssue = () => console.log("Opening issue report form");

  useEffect(() => {
    const teamId = getCurrentTeamId();
    if (!teamId) {
      navigate('/team-setup');
    }
  }, [navigate]);

  useEffect(() => {
    const loadCounts = async () => {
      const teamId = getCurrentTeamId();
      // total teams
      const { count: teamsCount } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true });
      setCountTeams(teamsCount ?? 0);

      if (!teamId) return;
      // players in current team
      const { count: playersCount } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId);
      setCountPlayers(playersCount ?? 0);

      // matches for current team
      const { count: matchesCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId);
      setCountMatches(matchesCount ?? 0);
    };
    loadCounts();
  }, [activeTab]);

  return (
    <section className="dashboard coach-dashboard">
      <DashboardSidebar onNavigate={setActiveTab} />
      <section>
        <DashboardHeader 
          onProfileClick={handleProfileClick}
          setActiveTab={setActiveTab}
          onReportIssue={handleReportIssue} 
        />

        <section className="stats-cards">
          <article className="stat-card white">
            <h3>{countTeams}</h3>
            <div>Total Teams</div>
          </article>
          <article className="stat-card blue">
            <h3>{countPlayers}</h3>
            <div>Total Players</div>
          </article>
          <article className="stat-card violet">
            <h3>{countMatches}</h3>
            <div>Matches</div>
          </article>
        </section>

        <section className="dashboard-content">
          {activeTab === "myTeam" && (
            <MyTeamTab teams={teams} setTeams={setTeams} navigate={navigate} />
          )}
          {activeTab === "matches" && (
            <MatchesPage />
          )}
          {activeTab === "players" && (
            <PlayerManagementPage />
          )}
        </section>
      </section>
    </section>
  );
};

export default CoachDashboard;