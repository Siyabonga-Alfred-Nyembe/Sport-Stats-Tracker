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

  
  const [teams, setTeams] = useState<Team[]>([]);

  

  useEffect(() => {
    const teamId = getCurrentTeamId();
    if (!teamId) {
      navigate('/team-setup');
    }
  }, [navigate]);

 

  return (
    <section className="dashboard coach-dashboard">
      <DashboardSidebar onNavigate={setActiveTab} />
      <section>
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