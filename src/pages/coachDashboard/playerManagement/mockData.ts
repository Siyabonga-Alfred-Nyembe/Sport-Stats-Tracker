// src/components/PlayerManagement/mockData.ts
import type { Player, Team } from '../../../types';

export const mockTeams: Team[] = [
  { id: 't1', name: 'Inter Miami', coachId: 'coach123' },
  { id: 't2', name: 'Al-Nassr', coachId: 'coach456' },
];

// This array contains a diverse set of real players for better testing
export const mockPlayers: Player[] = [
  {
    id: "p1",
    name: "Lionel Messi",
    teamId: "t1",
    position: "ST", // Striker
    jerseyNum: "10",
    imageUrl: "/images/messi.jpg", // Assuming you have a local image
    stats: {
      goals: 25, assists: 18, shots: 85, shotsOnTarget: 55, chancesCreated: 75,
      tackles: 15, interceptions: 8, clearances: 2, saves: 0, cleansheets: 0, savePercentage: 0,
      passCompletion: 88, minutesPlayed: 2850, yellowCards: 3, redCards: 0,
      performanceData: [2, 1, 0, 3, 1] // Goals in last 5 matches
    },
  },
  {
    id: "p2",
    name: "Virgil van Dijk",
    teamId: "t1",
    position: "DEF", // Defender
    jerseyNum: "4",
    imageUrl: "/images/vandijk.jpg",
    stats: {
      goals: 4, assists: 1, shots: 20, shotsOnTarget: 10, chancesCreated: 5,
      tackles: 65, interceptions: 55, clearances: 120, saves: 0, cleansheets: 0, savePercentage: 0,
      passCompletion: 92, minutesPlayed: 3200, yellowCards: 2, redCards: 0,
      performanceData: [15, 12, 18, 14, 11] // Tackles in last 5 matches
    },
  },
  {
    id: "p3",
    name: "Kevin De Bruyne",
    teamId: "t1",
    position: "CAM", // Attacking Midfielder
    jerseyNum: "17",
    imageUrl: "/images/debruyne.jpg",
    stats: {
      goals: 15, assists: 22, shots: 70, shotsOnTarget: 40, chancesCreated: 110,
      tackles: 30, interceptions: 25, clearances: 10, saves: 0, cleansheets: 0, savePercentage: 0,
      passCompletion: 85, minutesPlayed: 2950, yellowCards: 4, redCards: 0,
      performanceData: [3, 5, 2, 6, 4] // Chances created in last 5 matches
    },
  },
  {
    id: "p4",
    name: "Alisson Becker",
    teamId: "t1",
    position: "GK", // Goalkeeper
    jerseyNum: "1",
    imageUrl: "/images/alisson.jpg",
    stats: {
      goals: 0, assists: 1, shots: 0, shotsOnTarget: 0, chancesCreated: 2,
      tackles: 1, interceptions: 0, clearances: 40, saves: 120, cleansheets: 18, savePercentage: 82,
      passCompletion: 75, minutesPlayed: 3420, yellowCards: 1, redCards: 0,
      performanceData: [5, 8, 3, 6, 7] // Saves in last 5 matches
    },
  }
];

// Note: The mockPlayersWithStats array you had is also good for testing with placeholder names.
// You can keep it if you like, just ensure it's imported correctly where needed.
export const mockPlayersWithStats: Player[] = [
  {
    id: 'p5',
    name: 'Leo Vega',
    teamId: 'team1',
    position: 'ST',
    jerseyNum: '9',
    stats: {
      goals: 12, assists: 4, shots: 35, shotsOnTarget: 22, chancesCreated: 18,
      tackles: 5, interceptions: 2, clearances: 1, saves: 0, cleansheets: 0, savePercentage: 0,
      passCompletion: 78, minutesPlayed: 1250, yellowCards: 2, redCards: 0,
      performanceData: [1, 0, 2, 1, 0]
    },
    imageUrl: 'https://via.placeholder.com/280x250/333/FFF?text=Leo+Vega',
  },
];