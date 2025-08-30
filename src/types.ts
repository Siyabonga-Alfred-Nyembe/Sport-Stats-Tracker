// src/types.ts

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

// ... other types like Team, Match, etc.