import supabase from '../../supabaseClient.ts';
import type { Match, DbMatchRecord, DbPlayerStatsRecord } from '../types';

export interface DbMatchEventRecord {
  id: string;
  match_id: string;
  player_id: string;
  event_type: 'goal' | 'assist' | 'yellow_card' | 'red_card';
  minute?: number;
}

export async function fetchMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('fetchMatches error', error);
    return [];
  }
  
  // Transform database records to Match interface
  return (data ?? []).map((match: DbMatchRecord): Match => ({
    id: match.id,
    teamId: match.team_id,
    opponentName: match.opponent_name,
    teamScore: match.team_score,
    opponentScore: match.opponent_score,
    date: match.date,
    status: match.status,
    possession: match.possession,
    shots: match.shots,
    shotsOnTarget: match.shots_on_target,
    corners: match.corners,
    fouls: match.fouls,
    offsides: match.offsides,
    passes: match.passes,
    passAccuracy: match.pass_accuracy,
    tackles: match.tackles,
    saves: match.saves,
  }));
}

export async function fetchMatchEvents(matchId: string): Promise<DbMatchEventRecord[]> {
  const { data, error } = await supabase
    .from('match_events')
    .select('*')
    .eq('match_id', matchId);
  
  if (error) {
    console.error('fetchMatchEvents error', error);
    return [];
  }
  
  return (data ?? []) as DbMatchEventRecord[];
}

export async function fetchPlayerStatsForMatch(matchId: string): Promise<DbPlayerStatsRecord[]> {
  const { data, error } = await supabase
    .from('player_stats')
    .select('*')
    .eq('match_id', matchId);
  
  if (error) {
    console.error('fetchPlayerStatsForMatch error', error);
    return [];
  }
  
  return (data ?? []) as DbPlayerStatsRecord[];
}

export async function fetchPlayerStatsForPlayer(playerId: string): Promise<DbPlayerStatsRecord[]> {
  const { data, error } = await supabase
    .from('player_stats')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('fetchPlayerStatsForPlayer error', error);
    return [];
  }
  
  return (data ?? []) as DbPlayerStatsRecord[];
}

export async function fetchTeamMatches(teamId: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('team_id', teamId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('fetchTeamMatches error', error);
    return [];
  }
  
  // Transform database records to Match interface
  return (data ?? []).map((match: DbMatchRecord): Match => ({
    id: match.id,
    teamId: match.team_id,
    opponentName: match.opponent_name,
    teamScore: match.team_score,
    opponentScore: match.opponent_score,
    date: match.date,
    status: match.status,
    possession: match.possession,
    shots: match.shots,
    shotsOnTarget: match.shots_on_target,
    corners: match.corners,
    fouls: match.fouls,
    offsides: match.offsides,
    passes: match.passes,
    passAccuracy: match.pass_accuracy,
    tackles: match.tackles,
    saves: match.saves,
  }));
}

export async function createMatch(matchData: Omit<DbMatchRecord, 'id'>): Promise<string | null> {
  const { data, error } = await supabase
    .from('matches')
    .insert([matchData])
    .select('id')
    .single();
  
  if (error) {
    console.error('createMatch error', error);
    return null;
  }
  
  return data?.id || null;
}

export async function updateMatch(matchId: string, matchData: Partial<DbMatchRecord>): Promise<boolean> {
  const { error } = await supabase
    .from('matches')
    .update(matchData)
    .eq('id', matchId);
  
  if (error) {
    console.error('updateMatch error', error);
    return false;
  }
  
  return true;
}

export async function createPlayerStats(statsData: Omit<DbPlayerStatsRecord, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
  const { data, error } = await supabase
    .from('player_stats')
    .insert([statsData])
    .select('id')
    .single();
  
  if (error) {
    console.error('createPlayerStats error', error);
    return null;
  }
  
  return data?.id || null;
}

export async function updatePlayerStats(statsId: string, statsData: Partial<DbPlayerStatsRecord>): Promise<boolean> {
  const { error } = await supabase
    .from('player_stats')
    .update(statsData)
    .eq('id', statsId);
  
  if (error) {
    console.error('updatePlayerStats error', error);
    return false;
  }
  
  return true;
}

export async function createMatchEvent(eventData: Omit<DbMatchEventRecord, 'id'>): Promise<string | null> {
  const { data, error } = await supabase
    .from('match_events')
    .insert([eventData])
    .select('id')
    .single();
  
  if (error) {
    console.error('createMatchEvent error', error);
    return null;
  }
  
  return data?.id || null;
}

export async function deleteMatchEvent(eventId: string): Promise<boolean> {
  const { error } = await supabase
    .from('match_events')
    .delete()
    .eq('id', eventId);
  
  if (error) {
    console.error('deleteMatchEvent error', error);
    return false;
  }
  
  return true;
}



