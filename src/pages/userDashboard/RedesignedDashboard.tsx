// pages/userDashboard/RedesignedDashboard.tsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Topbar from "./Topbar.tsx";
import Sidebar from "./Sidebar.tsx";
import StatsCards from "./StatsCards.tsx";
import MatchesList from "./MatchList.tsx";
import TeamsList from "./TeamsList";
import PlayersList from "./PlayersList";
import { useFavoriteTeams } from "./hooks/useFavorites.ts";
import MatchDetail from "./MatchDetail.tsx";
import Chat from "./Chat.tsx";
// Types kept for reference; UI types are derived via useDbData
import { useLocalStorage } from "./hooks/useLocalStorage.ts";
import { useDbData } from "./hooks/useDbData.ts";
import "../../Styles/user-dashboard.css";
import menImg from "../../images/menu.png"


const USERNAME_KEY = "rs_dashboard_username_v2";
type Tab = "overview"|"teams"|"players"|"matches"|"favorites";

const RedesignedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { teams, players, matches, loading, error } = useDbData();
  const { favoriteTeamIds, loading: favoritesLoading } = useFavoriteTeams();

  const [activeTab, setActiveTab] = useState<"overview"|"teams"|"players"|"matches"|"favorites">("overview");
  const [selectedMatchId, setSelectedMatchId] = useState<string|null>(null);
  const [query, setQuery] = useState("");
  const [username, setUsername] = useLocalStorage(USERNAME_KEY, "Fan");

  const filteredMatches = useMemo(()=> {
    if (!query.trim()) return matches;
    const q = query.toLowerCase();
    return matches.filter(m=>{
      const home = teams.find(t => t.id === m.homeTeamId)?.name.toLowerCase() || "";
      const away = teams.find(t => t.id === m.awayTeamId)?.name.toLowerCase() || "";
      return home.includes(q) || away.includes(q) || m.date.includes(q);
    });
  }, [query, matches, teams]);

  const recentMatches = useMemo(()=> matches.slice(0, 5), [matches]);

  // sync tab and selected match with URL
  React.useEffect(() => {
    const path = location.pathname.replace(/^\//, "");
    const [segment, maybeId] = path.split("/");
    if (segment === "overview" || segment === "teams" || segment === "players" || segment === "matches" || segment === "favorites") {
      setActiveTab(segment as Tab);
    } else if (segment === "user-dashboard" || segment === "") {
      setActiveTab("overview");
    }
    if (segment === "matches" && maybeId) {
      setSelectedMatchId(maybeId);
    } else if (segment !== "matches") {
      setSelectedMatchId(null);
    }
  }, [location.pathname]);

  const selectedMatch = selectedMatchId ? matches.find(m => m.id === selectedMatchId) || null : null;
  const homeTeam = selectedMatch ? teams.find(t => t.id === selectedMatch.homeTeamId) : null;
  const awayTeam = selectedMatch ? teams.find(t => t.id === selectedMatch.awayTeamId) : null;

  return (
    <div className="rs-dashboard">
     
      <div className="rs-container">
        <aside className="rs-sidebar">
          <Sidebar activeTab={activeTab} goToTab={(t: Tab) => { setActiveTab(t); navigate(t === "overview" ? "/user-dashboard" : `/${t}`); setSelectedMatchId(null); }} />
            <Topbar username={username} setUsername={setUsername} onProfile={()=>navigate("/profile-settings")} />
        </aside>
           
       
        <main className="rs-main">
          <div className="rs-card">
            {loading && <div style={{color:"var(--muted)"}}>Loading...</div>}
            {error && <div style={{color:"var(--danger)"}}>{error}</div>}
            {activeTab === "overview" && (
              <>
                <StatsCards teams={teams.length} players={players.length} matches={matches.length} />
                <MatchesList matches={recentMatches} teams={teams} query={query} setQuery={setQuery} onOpen={(id)=>{ setSelectedMatchId(id); navigate(`/matches/${id}`); setActiveTab("matches"); }} />
              </>
            )}
            {activeTab === "matches" && (
              <>
                <MatchesList matches={filteredMatches} teams={teams} query={query} setQuery={setQuery} onOpen={(id)=>{ setSelectedMatchId(id); navigate(`/matches/${id}`); }} />
                {selectedMatch && (
                  <div style={{marginTop:14}} className="rs-detail-wrapper">
                    <MatchDetail match={selectedMatch} homeTeam={homeTeam} awayTeam={awayTeam} players={players} />
                    <Chat matchId={selectedMatch.id} username={username} />
                  </div>
                )}
              </>
            )}
            {activeTab === "teams" && (
              <TeamsList teams={teams} />
            )}
            {activeTab === "players" && (
              <PlayersList players={players} teams={teams} />
            )}
            {activeTab === "favorites" && (
              <>
                {favoritesLoading && <div style={{color:"var(--muted)"}}>Loading favorites...</div>}
                <TeamsList teams={teams.filter(t => favoriteTeamIds.includes(t.id))} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RedesignedDashboard;
