import { useEffect, useMemo, useState } from "react";
import { fetchMatches } from "../../../services/matchService.ts";
import { fetchPlayers } from "../../../services/playerService.ts";
import { fetchTeamById } from "../../../services/teamService.ts";

export interface UiTeam { id: string; name: string; isFavorite?: boolean; }
export interface UiPlayer { id: string; name: string; teamId: string; position: string; stats: { goals: number; assists: number; minutesPlayed: number }; }
export interface UiMatch { id: string; homeTeamId: string; awayTeamId: string; homeScore: number; awayScore: number; date: string; status: "confirmed" | "pending" | "finished"; }

// Map DB -> UI types minimally so dashboard can stay modular
export function useDbData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<UiTeam[]>([]);
  const [players, setPlayers] = useState<UiPlayer[]>([]);
  const [matches, setMatches] = useState<UiMatch[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [dbMatches, dbPlayers] = await Promise.all([
          fetchMatches(),
          fetchPlayers(),
        ]);

        // gather teams referenced by matches and players
        const teamIds = new Set<string>();
        dbPlayers.forEach(p => teamIds.add(p.team_id));
        dbMatches.forEach(m => teamIds.add(m.team_id));

        const uniqueIds = Array.from(teamIds);
        const teamResults = await Promise.all(uniqueIds.map(id => fetchTeamById(id)));
        const uiTeamsMap = new Map<string, UiTeam>();
        teamResults.filter(Boolean).forEach(t => { uiTeamsMap.set(t!.id, { id: t!.id, name: t!.name }); });

        const uiPlayers: UiPlayer[] = dbPlayers.map(p => ({
          id: p.id,
          name: p.name,
          teamId: p.team_id,
          position: p.position ?? "",
          stats: { goals: 0, assists: 0, minutesPlayed: 0 },
        }));

        // Map matches where "team" is the home team and opponent is away
        const uiMatches: UiMatch[] = dbMatches.map(m => ({
          id: m.id,
          homeTeamId: m.team_id,
          awayTeamId: `opponent:${m.opponent_name}`,
          homeScore: m.team_score,
          awayScore: m.opponent_score,
          date: m.date,
          status: m.status === 'completed' ? 'finished' : 'confirmed',
        }));

        // Create pseudo teams for opponents so UI can resolve names
        dbMatches.forEach(m => {
          const oppId = `opponent:${m.opponent_name}`;
          if (!uiTeamsMap.has(oppId)) {
            uiTeamsMap.set(oppId, { id: oppId, name: m.opponent_name });
          }
        });

        const uiTeams = Array.from(uiTeamsMap.values());

        if (!mounted) return;
        setTeams(uiTeams);
        setPlayers(uiPlayers);
        setMatches(uiMatches);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load data');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const derived = useMemo(() => ({ teams, players, matches }), [teams, players, matches]);
  return { ...derived, loading, error };
}


