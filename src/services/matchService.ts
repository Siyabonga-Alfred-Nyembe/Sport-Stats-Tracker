import supabase from '../../supabaseClient.ts';

export interface DbMatchRecord {
  id: string;
  team_id: string;
  opponent_name: string;
  team_score: number;
  opponent_score: number;
  date: string; // date
  status: 'scheduled' | 'completed';
}

export interface DbMatchEventRecord {
  id: string;
  match_id: string;
  player_id: string | null;
  event_type: 'goal' | 'assist' | 'yellow_card' | 'red_card';
  minute: number | null;
}

export async function fetchMatches(): Promise<DbMatchRecord[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('date', { ascending: false });
  if (error) {
    console.error('fetchMatches error', error);
    return [];
  }
  return (data ?? []) as unknown as DbMatchRecord[];
}

export async function fetchMatchEvents(matchId: string): Promise<DbMatchEventRecord[]> {
  const { data, error } = await supabase
    .from('match_events')
    .select('*')
    .eq('match_id', matchId)
    .order('minute', { ascending: true });
  if (error) {
    console.error('fetchMatchEvents error', error);
    return [];
  }
  return (data ?? []) as unknown as DbMatchEventRecord[];
}



