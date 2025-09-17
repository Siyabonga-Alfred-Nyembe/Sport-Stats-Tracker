import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import MyTeamTab from "./coachStatsPage/MyTeamTab";
// Updated import to use the correct name for clarity
import MatchesPage from "./matchManaging/MatchesPage";
import PlayerManagementPage from "./playerManagement/PlayerManagementPage";
import "../../Styles/coach-dashboard.css";
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
  const [activeTab, setActiveTab] = useState("myTeam"); // Default to matches to see it working
  const [username, setUsername] = useState<string>("");
  
  // These states are no longer used by their respective pages but may be used by other tabs.
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUsername(session.user.email || 'Coach');
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const teamId = getCurrentTeamId();
    if (!teamId) {
      navigate('/team-setup');
    }
  }, [navigate]);

  const handleProfileClick = () => {
    navigate('/profile-settings');
  };

  const handleReportIssue = () => {
    // Handle report issue functionality
    console.log('Report issue clicked');
  };

  return (
    <section className="dashboard coach-dashboard">
      <DashboardHeader 
        onProfileClick={handleProfileClick}
        setActiveTab={setActiveTab}
        onReportIssue={handleReportIssue}
        username={username}
      />
      <DashboardSidebar onNavigate={setActiveTab} />
      <section className="dashboard-content">
        {activeTab === "myTeam" && (
          <MyTeamTab />
        )}
        {activeTab === "matches" && (
          <MatchesPage />
        )}
        {activeTab === "players" && (
          <PlayerManagementPage />
        )}
      </section>
    </section>
  );
};

export default CoachDashboard;