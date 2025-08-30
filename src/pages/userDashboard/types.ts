// Player statistics
export interface PlayerStats {
  // Attacking
  goals: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  chancesCreated: number;

  // Defending
  tackles: number;
  interceptions: number;
  clearances: number;

  // Goalkeeping
  saves: number;
  cleansheets: number;
  savePercentage: number;

  // General
  passCompletion: number;
  minutesPlayed: number;
  yellowCards: number;
  redCards: number;

  // Data for the graph (e.g., goals over the last 5 matches)
  performanceData: number[];
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  jerseyNum: string;
  stats: PlayerStats;
  imageUrl: string;
}

export interface Team {
  id: string;
  name: string;
  coachId: string;
}

// Events within a match
export interface MatchEvent {
  id: string;
  matchId: string;
  playerId: string;
  eventType: 'goal' | 'assist' | 'yellow_card' | 'red_card';
  minute?: number; // Optional: The minute the event occurred
}

// The main Match object, with team-level stats
export interface Match {
  id: string;
  teamId: string;          // Your team's ID
  opponentName: string;
  teamScore: number;
  opponentScore: number;
  date: string;
  status: 'scheduled' | 'completed';

  // Team-level stats
  possession?: number;     // Your team's possession %
  shots?: number;
  shotsOnTarget?: number;
  corners?: number;
  fouls?: number;
  offsides?: number;
  xg?: number;             // Expected goals
  passes?: number;
  passAccuracy?: number;   // %
  tackles?: number;
  saves?: number;
}
