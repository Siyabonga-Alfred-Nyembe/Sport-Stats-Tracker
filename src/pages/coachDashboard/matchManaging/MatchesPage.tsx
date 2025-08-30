// src/components/Matches/MatchesPage.tsx

import React, { useEffect, useMemo, useState } from 'react';
import MatchDetailsModal from './MatchDetailsModal';
import './MatchesPage.css';
import supabase from '../../../../supabaseClient';
import InlineAlert from '../../components/InlineAlert';
import type {Team,PlayerStats,Player,MatchEvent,Match} from '../../../types'
import MatchCard from '../../components/matchCard'; // Import the new MatchCard component
import { getCurrentTeamId } from '../../../services/teamService';

const MatchesPage: React.FC = () => {
  // Team resolution: replace with actual auth-bound team if available
  const currentTeamId = getCurrentTeamId() || 'kaizer_chiefs';
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const currentTeam = useMemo(() => ({ id: currentTeamId, name: 'My Team', coachId: 'coach' }), []);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [opponentName, setOpponentName] = useState('');
  const [teamScore, setTeamScore] = useState('');
  const [opponentScore, setOpponentScore] = useState('');
  const [date, setDate] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Load matches, events, players
  useEffect(() => {
    const loadData = async () => {
      // Matches
      const { data: matchRows, error: matchErr } = await supabase
        .from('matches')
        .select('*')
        .eq('team_id', currentTeamId)
        .order('date', { ascending: false });
      if (!matchErr && matchRows) {
        const mapped: Match[] = matchRows.map((m: any) => ({
          id: String(m.id),
          teamId: m.team_id,
          opponentName: m.opponent_name,
          teamScore: m.team_score ?? 0,
          opponentScore: m.opponent_score ?? 0,
          date: m.date,
          status: (m.status as 'scheduled' | 'completed') ?? 'scheduled',
          possession: m.possession ?? undefined,
          shots: m.shots ?? undefined,
          shotsOnTarget: m.shots_on_target ?? undefined,
        }));
        setMatches(mapped);
      } else if (matchErr) {
        setErrorMsg('We could not load your matches. Please refresh or try again later.');
      }

      // Events
      const { data: eventRows } = await supabase
        .from('match_events')
        .select('*')
        .in('match_id', (matchRows ?? []).map((m: any) => m.id));
      if (eventRows) {
        const evs: MatchEvent[] = eventRows.map((e: any) => ({
          id: String(e.id),
          matchId: String(e.match_id),
          playerId: String(e.player_id),
          eventType: e.event_type,
          minute: e.minute ?? undefined,
        }));
        setMatchEvents(evs);
      }

      // Players
      const { data: playerRows } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', currentTeamId);
      if (playerRows) {
        const mappedPlayers: Player[] = playerRows.map((p: any) => ({
  id: String(p.id),
  name: p.name,
  jerseyNum: String(p.jersey_num ?? ''),
  teamId: p.team_id,
  position: p.position ?? '',
  stats: {
    goals: 0,
    assists: 0,
    shots: 0,
    shotsOnTarget: 0,
    chancesCreated: 0,
    tackles: 0,
    interceptions: 0,
    clearances: 0,
    saves: 0,
    cleansheets: 0,
    savePercentage: 0,
    passCompletion: 0,
    minutesPlayed: 0,
    yellowCards: 0,
    redCards: 0,
    performanceData: [],
  },
  imageUrl:
    p.image_url ??
    `https://via.placeholder.com/280x250/8a2be2/FFF?text=${encodeURIComponent(
      p.name
    )}`,
}));

        setPlayers(mappedPlayers);
      } else {
        setErrorMsg((prev) => prev ?? 'We could not load your players. Please refresh or try again later.');
      }
    };
    loadData();
  }, [currentTeamId]);

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponentName || !date) return;
    const payload = {
      team_id: currentTeam.id,
      opponent_name: opponentName,
      team_score: Number(teamScore) || 0,
      opponent_score: Number(opponentScore) || 0,
      date,
      status: 'completed',
    };
    const { data, error } = await supabase.from('matches').insert(payload).select().single();
    if (!error && data) {
      const saved: Match = {
        id: String(data.id),
        teamId: data.team_id,
        opponentName: data.opponent_name,
        teamScore: data.team_score ?? 0,
        opponentScore: data.opponent_score ?? 0,
        date: data.date,
        status: data.status,
        possession: data.possession ?? undefined,
        shots: data.shots ?? undefined,
        shotsOnTarget: data.shots_on_target ?? undefined,
      };
      setMatches(prev => [saved, ...prev]);
    } else if (error) {
      console.error('Failed to insert match:', error);
      setErrorMsg('We could not save your match. Please check your permissions and try again.');
    }
    setOpponentName('');
    setTeamScore('');
    setOpponentScore('');
    setDate('');
  };

  const handleUpdateTeamStats = async (matchId: string, stats: Partial<Match>) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, ...stats } : m));
    const toDb: any = {};
    if (stats.possession !== undefined) toDb.possession = stats.possession;
    if (stats.shots !== undefined) toDb.shots = stats.shots;
    if (stats.shotsOnTarget !== undefined) toDb.shots_on_target = stats.shotsOnTarget;
    if ((stats as any).corners !== undefined) toDb.corners = (stats as any).corners;
    if ((stats as any).fouls !== undefined) toDb.fouls = (stats as any).fouls;
    if ((stats as any).offsides !== undefined) toDb.offsides = (stats as any).offsides;
    if ((stats as any).xg !== undefined) toDb.xg = (stats as any).xg;
    if ((stats as any).passes !== undefined) toDb.passes = (stats as any).passes;
    if ((stats as any).passAccuracy !== undefined) toDb.pass_accuracy = (stats as any).passAccuracy;
    if ((stats as any).tackles !== undefined) toDb.tackles = (stats as any).tackles;
    if ((stats as any).saves !== undefined) toDb.saves = (stats as any).saves;
    const { error } = await supabase.from('matches').update(toDb).eq('id', matchId);
    if (error) setErrorMsg('We could not update the match stats. Please try again.');
  };
  
  const handleAddPlayerEvent = async (_eventId: string, matchId: string, playerId: string, eventType: MatchEvent['eventType']) => {
    const payload = { match_id: matchId, player_id: playerId, event_type: eventType };
    const { data, error } = await supabase.from('match_events').insert(payload).select().single();
    if (!error && data) {
      const newEvent: MatchEvent = { id: String(data.id), matchId: String(data.match_id), playerId: String(data.player_id), eventType: data.event_type, minute: data.minute ?? undefined };
      setMatchEvents(prev => [...prev, newEvent]);
    } else if (error) {
      console.error('Failed to insert match event:', error);
      setErrorMsg('We could not log that event. Please try again.');
    }
  };
  
  const handleRemovePlayerEvent = async (eventId: string) => {
    setMatchEvents(prev => prev.filter(e => e.id !== eventId));
    const { error } = await supabase.from('match_events').delete().eq('id', eventId);
    if (error) {
      console.error('Failed to delete match event:', error);
      setErrorMsg('We could not remove that event. Please try again.');
    }
  };

  return (
    <main className="matches-container">
      <InlineAlert message={errorMsg} onClose={() => setErrorMsg(null)} />
      <section className="management-section">
        <h2 className="section-title">Match Center</h2>
        {/* The form for creating a new match remains the same */}
        <form onSubmit={handleCreateMatch} className="add-player-form">
          <h3>Log a New Match</h3>
          <input type="text" placeholder="Opponent Name" value={opponentName} onChange={e => setOpponentName(e.target.value)} required />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <div className="score-inputs">
            <input type="number" min="0"placeholder="Your Score" value={teamScore} onChange={e => setTeamScore(e.target.value)} />
            <input type="number" min="0" placeholder="Opponent Score" value={opponentScore} onChange={e => setOpponentScore(e.target.value)} />
          </div>
          <button type="submit">Create Match</button>
        </form>
        
        <div className="match-list">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Search teams or dates"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: 8, borderRadius: 8, border: '1px solid #e2e8f0' }}
            />
          </div>
          {matches.filter(m => {
            const q = search.toLowerCase();
            if (!q) return true;
            return m.opponentName.toLowerCase().includes(q) || (m.date || '').includes(q);
          }).map(match => (
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