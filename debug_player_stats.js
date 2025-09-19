// Debug script to test player stats database operations
// Run this in the browser console to debug the issue

async function debugPlayerStats() {
  console.log('🔍 Debugging Player Stats Database Operations...');
  
  try {
    // Import supabase client
    const { default: supabase } = await import('./supabaseClient.ts');
    
    // Test 1: Check if player_stats table exists and is accessible
    console.log('\n📊 Test 1: Check player_stats table');
    const { data: tableCheck, error: tableError } = await supabase
      .from('player_stats')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Table access error:', tableError);
      return;
    }
    console.log('✅ Table accessible, sample data:', tableCheck);
    
    // Test 2: Check if there are any player stats records
    console.log('\n📊 Test 2: Check existing player stats');
    const { data: allStats, error: statsError } = await supabase
      .from('player_stats')
      .select('*')
      .limit(10);
    
    if (statsError) {
      console.error('❌ Stats fetch error:', statsError);
      return;
    }
    console.log('📈 Found stats records:', allStats?.length || 0);
    if (allStats && allStats.length > 0) {
      console.log('Sample record:', allStats[0]);
    }
    
    // Test 3: Check players table
    console.log('\n👥 Test 3: Check players table');
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('id, name, team_id')
      .limit(5);
    
    if (playersError) {
      console.error('❌ Players fetch error:', playersError);
      return;
    }
    console.log('👥 Found players:', players?.length || 0);
    if (players && players.length > 0) {
      console.log('Sample player:', players[0]);
    }
    
    // Test 4: Check matches table
    console.log('\n⚽ Test 4: Check matches table');
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('id, team_id, opponent_name, status')
      .limit(5);
    
    if (matchesError) {
      console.error('❌ Matches fetch error:', matchesError);
      return;
    }
    console.log('⚽ Found matches:', matches?.length || 0);
    if (matches && matches.length > 0) {
      console.log('Sample match:', matches[0]);
    }
    
    // Test 5: Try to insert a test player stat record
    if (players && players.length > 0 && matches && matches.length > 0) {
      console.log('\n🧪 Test 5: Try to insert test player stat');
      const testPlayerId = players[0].id;
      const testMatchId = matches[0].id;
      
      const { data: insertData, error: insertError } = await supabase
        .from('player_stats')
        .insert([{
          player_id: testPlayerId,
          match_id: testMatchId,
          goals: 1,
          assists: 0,
          shots: 3,
          shots_on_target: 2,
          minutes_played: 90,
          pass_completion: 85.5
        }])
        .select('id');
      
      if (insertError) {
        console.error('❌ Insert test error:', insertError);
      } else {
        console.log('✅ Insert test successful:', insertData);
        
        // Clean up test record
        if (insertData && insertData[0]) {
          await supabase
            .from('player_stats')
            .delete()
            .eq('id', insertData[0].id);
          console.log('🧹 Test record cleaned up');
        }
      }
    }
    
    // Test 6: Check schema structure
    console.log('\n🏗️ Test 6: Check table structure');
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'player_stats' });
    
    if (columnsError) {
      console.log('ℹ️ Could not fetch column info (RPC not available)');
    } else {
      console.log('📋 Table columns:', columns);
    }
    
    console.log('\n✅ Debug completed!');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Export for browser console use
window.debugPlayerStats = debugPlayerStats;

console.log('🔧 Player stats debug script loaded!');
console.log('Run debugPlayerStats() to test the database connection and schema');
