// src/pages/coachDashboard/mockMatchData.ts
import type { Match } from '../../../types';

// Let's assume the team's ID is 'team1'
export const mockTeamMatches: Match[] = [
  { id: 'm1', teamId: 'team1', opponentName: 'Galaxy Wanderers', teamScore: 3, opponentScore: 1, date: '2025-08-20', status: 'completed', possession: 62, shots: 14, fouls: 8},
  { id: 'm2', teamId: 'team1', opponentName: 'Starlight Strikers', teamScore: 2, opponentScore: 2, date: '2025-08-12', status: 'completed', possession: 55, shots: 12, fouls: 12},
  { id: 'm3', teamId: 'team1', opponentName: 'Nebula Nomads', teamScore: 1, opponentScore: 0, date: '2025-08-05', status: 'completed', possession: 48, shots: 8, fouls: 15},
  { id: 'm4', teamId: 'team1', opponentName: 'Meteor FC', teamScore: 0, opponentScore: 1, date: '2025-07-28', status: 'completed', possession: 45, shots: 7, fouls: 11},
  { id: 'm5', teamId: 'team1', opponentName: 'Orion Rovers', teamScore: 4, opponentScore: 2, date: '2025-07-21', status: 'completed', possession: 68, shots: 18, fouls: 7},
  { id: 'm6', teamId: 'team1', opponentName: 'Cosmic Comets', teamScore: 2, opponentScore: 0, date: '2025-07-14', status: 'completed', possession: 59, shots: 15, fouls: 9 },
  { id: 'm7', teamId: 'team1', opponentName: 'Solar Flares', teamScore: 1, opponentScore: 1, date: '2025-07-07', status: 'completed', possession: 51, shots: 11, fouls: 13  },
];