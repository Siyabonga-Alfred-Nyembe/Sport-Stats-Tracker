import supabase from '../../supabaseClient.ts';


export interface DbLineupRecord {
  id: string;
  team_id: string;
  player_id: string;
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
}

export interface LineupPlayer {
  playerId: string;
  positionX: number;
  positionY: number;
}

export async function saveLineup(teamId: string, lineupPlayers: LineupPlayer[]): Promise<boolean> {
  try {
    // First, delete existing lineup for this team
    const { error: deleteError } = await supabase
      .from('lineups')
      .delete()
      .eq('team_id', teamId);
    
    if (deleteError) {
      console.error('Error deleting existing lineup:', deleteError);
      return false;
    }

    // If no players in lineup, just return success
    if (lineupPlayers.length === 0) {
      return true;
    }

    // Insert new lineup data
    const lineupData = lineupPlayers.map(player => ({
      team_id: teamId,
      player_id: player.playerId,
      position_x: player.positionX,
      position_y: player.positionY,
    }));

    const { error: insertError } = await supabase
      .from('lineups')
      .insert(lineupData);
    
    if (insertError) {
      console.error('Error saving lineup:', insertError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving lineup:', error);
    return false;
  }
}

export async function loadLineup(teamId: string): Promise<LineupPlayer[]> {
  try {
    const { data, error } = await supabase
      .from('lineups')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error loading lineup:', error);
      return [];
    }

    return (data || []).map((record: DbLineupRecord) => ({
      playerId: record.player_id,
      positionX: record.position_x,
      positionY: record.position_y,
    }));
  } catch (error) {
    console.error('Error loading lineup:', error);
    return [];
  }
}

export async function updatePlayerPosition(
  teamId: string, 
  playerId: string, 
  positionX: number, 
  positionY: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('lineups')
      .update({
        position_x: positionX,
        position_y: positionY,
        updated_at: new Date().toISOString(),
      })
      .eq('team_id', teamId)
      .eq('player_id', playerId);
    
    if (error) {
      console.error('Error updating player position:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating player position:', error);
    return false;
  }
}

export async function addPlayerToLineup(
  teamId: string, 
  playerId: string, 
  positionX: number, 
  positionY: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('lineups')
      .insert({
        team_id: teamId,
        player_id: playerId,
        position_x: positionX,
        position_y: positionY,
      });
    
    if (error) {
      console.error('Error adding player to lineup:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error adding player to lineup:', error);
    return false;
  }
}

export async function removePlayerFromLineup(teamId: string, playerId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('lineups')
      .delete()
      .eq('team_id', teamId)
      .eq('player_id', playerId);
    
    if (error) {
      console.error('Error removing player from lineup:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error removing player from lineup:', error);
    return false;
  }
}
