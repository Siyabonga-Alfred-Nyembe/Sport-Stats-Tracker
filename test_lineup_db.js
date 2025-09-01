// Test script to verify lineup database operations
// Run this in the browser console to test the lineup functionality

async function testLineupDatabase() {
  console.log('🧪 Testing Lineup Database Operations...');
  
  // Import the lineup service functions
  const { loadLineup, saveLineup, debugLineup } = await import('./src/services/lineupService.ts');
  
  // Get current team ID (you'll need to replace this with an actual team ID)
  // Note: team_id is now TEXT (e.g., 'kaizer_chiefs') not UUID
  const currentTeamId = 'kaizer_chiefs'; // Replace with your actual team ID
  
  try {
    // Test 1: Debug current lineup
    console.log('\n📊 Test 1: Debug current lineup');
    await debugLineup(currentTeamId);
    
    // Test 2: Save a test lineup
    console.log('\n📝 Test 2: Save test lineup');
    const testLineup = [
      { playerId: 'player-1', positionX: 50, positionY: 85 },
      { playerId: 'player-2', positionX: 25, positionY: 70 },
      { playerId: 'player-3', positionX: 75, positionY: 70 }
    ];
    
    const saveResult = await saveLineup(currentTeamId, testLineup);
    console.log('Save result:', saveResult);
    
    // Test 3: Load the lineup back
    console.log('\n📖 Test 3: Load lineup');
    const loadedLineup = await loadLineup(currentTeamId);
    console.log('Loaded lineup:', loadedLineup);
    
    // Test 4: Debug again to see the saved data
    console.log('\n📊 Test 4: Debug after save');
    await debugLineup(currentTeamId);
    
    console.log('\n✅ Lineup database tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Function to check if lineups table exists
async function checkLineupsTable() {
  console.log('🔍 Checking if lineups table exists...');
  
  try {
    const { data, error } = await supabase
      .from('lineups')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Lineups table error:', error);
      console.log('💡 You may need to create the lineups table using the SQL schema provided.');
    } else {
      console.log('✅ Lineups table exists and is accessible');
      console.log('📊 Sample data:', data);
    }
  } catch (error) {
    console.error('❌ Error checking lineups table:', error);
  }
}

// Function to get current team ID from the app
async function getCurrentTeamId() {
  try {
    // Try to get team ID from localStorage or other sources
    const teamId = localStorage.getItem('currentTeamId') || 'kaizer_chiefs';
    console.log('🔍 Current team ID:', teamId);
    return teamId;
  } catch (error) {
    console.error('❌ Error getting team ID:', error);
    return 'kaizer_chiefs'; // fallback
  }
}

// Function to test with actual team data
async function testWithRealTeam() {
  console.log('🧪 Testing with real team data...');
  
  const teamId = await getCurrentTeamId();
  const { loadLineup, saveLineup, debugLineup } = await import('./src/services/lineupService.ts');
  
  try {
    // First check if the team exists
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();
    
    if (teamError || !teamData) {
      console.error('❌ Team not found:', teamId);
      console.log('💡 Available teams:');
      const { data: allTeams } = await supabase.from('teams').select('id, name');
      console.log(allTeams);
      return;
    }
    
    console.log('✅ Found team:', teamData);
    
    // Check if team has players
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('id, name, position')
      .eq('team_id', teamId);
    
    if (playersError) {
      console.error('❌ Error loading players:', playersError);
      return;
    }
    
    console.log('📊 Team players:', players);
    
    if (players && players.length > 0) {
      // Test with real player IDs
      const testLineup = players.slice(0, 3).map((player, index) => ({
        playerId: player.id,
        positionX: 25 + (index * 25),
        positionY: 50 + (index * 10)
      }));
      
      console.log('📝 Testing with real players:', testLineup);
      const saveResult = await saveLineup(teamId, testLineup);
      console.log('Save result:', saveResult);
      
      await debugLineup(teamId);
    } else {
      console.log('ℹ️ No players found for team, cannot test lineup');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export functions for use in browser console
window.testLineupDatabase = testLineupDatabase;
window.checkLineupsTable = checkLineupsTable;
window.getCurrentTeamId = getCurrentTeamId;
window.testWithRealTeam = testWithRealTeam;

console.log('🧪 Lineup test functions loaded!');
console.log('Run checkLineupsTable() to check if the table exists');
console.log('Run getCurrentTeamId() to see current team ID');
console.log('Run testLineupDatabase() to test lineup operations');
console.log('Run testWithRealTeam() to test with actual team data');
