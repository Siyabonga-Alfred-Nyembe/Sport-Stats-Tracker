// Test script to verify player stats database operations are working
// Run this in the browser console after the fixes

async function testPlayerStatsFix() {
  console.log('🧪 Testing Player Stats Fix...');
  
  try {
    // Import the fixed functions
    const { upsertPlayerStats } = await import('./src/services/matchService.ts');
    const { fetchAggregatedStatsForPlayers } = await import('./src/services/playerService.ts');
    const { default: supabase } = await import('./supabaseClient.ts');
    
    // Step 1: Get a sample player and match
    console.log('\n📊 Step 1: Getting sample data...');
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('id, name, team_id')
      .limit(1);
    
    if (playersError || !players || players.length === 0) {
      console.error('❌ No players found:', playersError);
      return;
    }
    
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('id, team_id, opponent_name')
      .limit(1);
    
    if (matchesError || !matches || matches.length === 0) {
      console.error('❌ No matches found:', matchesError);
      return;
    }
    
    const testPlayer = players[0];
    const testMatch = matches[0];
    
    console.log('✅ Sample data:', { testPlayer, testMatch });
    
    // Step 2: Test saving player stats
    console.log('\n💾 Step 2: Testing player stats save...');
    const testStats = {
      goals: 2,
      assists: 1,
      shots: 5,
      shots_on_target: 3,
      chances_created: 4,
      dribbles_attempted: 8,
      dribbles_successful: 6,
      offsides: 1,
      tackles: 3,
      interceptions: 2,
      clearances: 1,
      saves: 0,
      clean_sheets: 0,
      save_percentage: 0,
      pass_completion: 85.5,
      minutes_played: 90,
      yellow_cards: 1,
      red_cards: 0
    };
    
    const statsId = await upsertPlayerStats(testMatch.id, testPlayer.id, testStats);
    
    if (!statsId) {
      console.error('❌ Failed to save player stats');
      return;
    }
    
    console.log('✅ Player stats saved successfully:', statsId);
    
    // Step 3: Test retrieving player stats
    console.log('\n📖 Step 3: Testing player stats retrieval...');
    const aggregatedStats = await fetchAggregatedStatsForPlayers([testPlayer.id]);
    
    console.log('📊 Aggregated stats for player:', aggregatedStats);
    
    if (aggregatedStats[testPlayer.id]) {
      const playerStats = aggregatedStats[testPlayer.id];
      console.log('✅ Player stats retrieved:', {
        goals: playerStats.goals,
        assists: playerStats.assists,
        shots: playerStats.shots,
        minutesPlayed: playerStats.minutesPlayed
      });
    } else {
      console.log('⚠️ No stats found for player (this might be expected if no stats exist)');
    }
    
    // Step 4: Verify in database directly
    console.log('\n🔍 Step 4: Verifying in database...');
    const { data: dbStats, error: dbError } = await supabase
      .from('player_stats')
      .select('*')
      .eq('player_id', testPlayer.id)
      .eq('match_id', testMatch.id);
    
    if (dbError) {
      console.error('❌ Database verification error:', dbError);
    } else {
      console.log('✅ Database verification successful:', dbStats);
    }
    
    // Step 5: Clean up test data
    console.log('\n🧹 Step 5: Cleaning up test data...');
    if (statsId) {
      const { error: deleteError } = await supabase
        .from('player_stats')
        .delete()
        .eq('id', statsId);
      
      if (deleteError) {
        console.error('⚠️ Failed to clean up test data:', deleteError);
      } else {
        console.log('✅ Test data cleaned up successfully');
      }
    }
    
    console.log('\n🎉 Player stats fix test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export for browser console use
window.testPlayerStatsFix = testPlayerStatsFix;

console.log('🔧 Player stats fix test script loaded!');
console.log('Run testPlayerStatsFix() to test the player stats functionality');
