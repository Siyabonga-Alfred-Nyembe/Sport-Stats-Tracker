// src/components/Matches/MatchesPage.tsx

import React, { useState } from 'react';
import MatchDetailsModal from './MatchDetailsModal';
import './MatchesPage.css';

// src/components/PlayerManagement/types.ts

export interface Team {
  id: string;
  name: string;
  coachId: string;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  minutesPlayed: number;
  yellowCards: number;
  redCards: number;
}

export interface Player {
    
  id: string;
  jerseyNum: string;
  name: string;
  teamId: string;
  position: string;
  stats: PlayerStats;
  imageUrl: string; // Added for the player card
}

export interface MatchEvent {
  id: string;
  matchId: string;
  playerId: string;
  eventType: 'goal' | 'assist' | 'yellow_card' | 'red_card';
  minute?: number; // Optional: The minute the event occurred
}

// The main Match object, now with team-level stats
export interface Match {
  id: string;
  teamId: string; // Your team's ID
  opponentName: string;
  teamScore: number;
  opponentScore: number;
  date: string;
  status: 'scheduled' | 'completed';
  
  // Team-level stats
  possession?: number; // Your team's possession %
  shots?: number;
  shotsOnTarget?: number;
}



export const mockMatches: Match[] = [
  {
    id: 'match1',
    teamId: 'team1',
    opponentName: 'Galaxy Wanderers',
    teamScore: 3,
    opponentScore: 1,
    date: '2025-08-20',
    status: 'completed',
    possession: 62,
    shots: 14,
    shotsOnTarget: 8,
  },
  {
    id: 'match2',
    teamId: 'team1',
    opponentName: 'Starlight Strikers',
    teamScore: 2,
    opponentScore: 2,
    date: '2025-08-12',
    status: 'completed',
  },
];

const mockPlayers: Player[] = [
  {
    id: 'p1',
    name: 'Leo Vega',
    jerseyNum: "10",
    teamId: 'team1',
    position: 'Striker',
    stats: { goals: 2, assists: 1, minutesPlayed: 90, yellowCards: 0, redCards: 0 },
    imageUrl: 'https://via.placeholder.com/280x250/8a2be2/FFF?text=Leo+Vega',
  },
  {
    id: 'p2',
    name: 'Mia Chen',
    jerseyNum: "10",
    teamId: 'team1',
    position: 'Midfielder',
    stats: { goals: 0, assists: 3, minutesPlayed: 90, yellowCards: 1, redCards: 0 },
    imageUrl: 'https://via.placeholder.com/280x250/333/FFF?text=Mia+Chen',
  },
  {
    id: 'p3',
    name: 'Sam Jones',
    jerseyNum: "10",
    teamId: 'team2',
    position: 'Defender',
    stats: { goals: 0, assists: 0, minutesPlayed: 75, yellowCards: 0, redCards: 0 },
    imageUrl: 'https://via.placeholder.com/280x250/555/FFF?text=Sam+Jones',
  },
];


const mockTeams: Team[] = [
  { id: 'team1', name: 'Red Lions', coachId: 'c1' },
  { id: 'team2', name: 'Blue Sharks', coachId: 'c2' },
];





// src/components/Matches/MatchesPage.tsx


import MatchCard from '../../components/matchCard'; // Import the new MatchCard component


const MatchesPage: React.FC = () => {
  // ... (All existing state and handler functions remain the same) ...
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([]);
  const [players] = useState<Player[]>(mockPlayers);
  const [teams] = useState<Team[]>(mockTeams);
  const currentTeam = teams[0];
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [opponentName, setOpponentName] = useState('');
  const [teamScore, setTeamScore] = useState('');
  const [opponentScore, setOpponentScore] = useState('');
  const [date, setDate] = useState('');

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponentName || !date) return;
    const newMatch: Match = {
      id: `match-${Date.now()}`,
      teamId: currentTeam.id,
      opponentName,
      teamScore: Number(teamScore) || 0,
      opponentScore: Number(opponentScore) || 0,
      date,
      status: 'completed',
    };
    setMatches(prev => [newMatch, ...prev]);
    setOpponentName('');
    setTeamScore('');
    setOpponentScore('');
    setDate('');
  };

  const handleUpdateTeamStats = (matchId: string, stats: Partial<Match>) => {
    setMatches(matches.map(m => m.id === matchId ? { ...m, ...stats } : m));
  };
  
  const handleAddPlayerEvent = (eventId: string, matchId: string, playerId: string, eventType: MatchEvent['eventType']) => {
    const newEvent: MatchEvent = { id: eventId, matchId, playerId, eventType };
    setMatchEvents(prev => [...prev, newEvent]);
  };
  
  const handleRemovePlayerEvent = (eventId: string) => {
    setMatchEvents(prev => prev.filter(e => e.id !== eventId));
  };

  return (
    <main className="matches-container">
      <section className="management-section">
        <h2 className="section-title">Match Center</h2>
        {/* The form for creating a new match remains the same */}
        <form onSubmit={handleCreateMatch} className="add-player-form">
          <h3>Log a New Match</h3>
          <input type="text" placeholder="Opponent Name" value={opponentName} onChange={e => setOpponentName(e.target.value)} required />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <div className="score-inputs">
            <input type="number" placeholder="Your Score" value={teamScore} onChange={e => setTeamScore(e.target.value)} />
            <input type="number" placeholder="Opponent Score" value={opponentScore} onChange={e => setOpponentScore(e.target.value)} />
          </div>
          <button type="submit">Create Match</button>
        </form>
        
        <div className="match-list">
          {matches.map(match => (
            // We wrap the new MatchCard in a div to handle the click event
            <div key={match.id} onClick={() => setSelectedMatch(match)}>
              <MatchCard
                teamA={currentTeam.name}
                teamB={match.opponentName}
                scoreA={match.teamScore}
                scoreB={match.opponentScore}
                date={match.date}
              />
            </div>
          ))}
        </div>
      </section>

      {/* The modal functionality remains unchanged */}
      {selectedMatch && (
        <MatchDetailsModal 
          match={selectedMatch}
          players={players.filter(p => p.teamId === currentTeam.id)}
          events={matchEvents.filter(e => e.matchId === selectedMatch.id)}
          onClose={() => setSelectedMatch(null)}
          onUpdateTeamStats={handleUpdateTeamStats}
          onAddPlayerEvent={handleAddPlayerEvent}
          onRemovePlayerEvent={handleRemovePlayerEvent}
        />
      )}
    </main>
  );
};

export default MatchesPage;