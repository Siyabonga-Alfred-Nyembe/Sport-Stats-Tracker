import supabase from '../../supabaseClient.ts';

export interface DbPlayerRecord {
  id: string;
  team_id: string;
  name: string;
  position: string | null;
  jersey_num: string | null;
  image_url: string | null;
}

export async function fetchPlayers(): Promise<DbPlayerRecord[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*');
  if (error) {
    console.error('fetchPlayers error', error);
    return [];
  }
  return (data ?? []) as unknown as DbPlayerRecord[];
}



