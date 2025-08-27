export interface Team {
  id: string;
  name: string;
  coachId: string;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  minutesPlayed: number;
  yellowCards: number;
  redCards: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  stats: PlayerStats;
  imageUrl: string; // Added for the player card
}

export const mockTeams: Team[] = [
  { id: 'team1', name: 'Cosmic Comets', coachId: 'coach123' },
  { id: 'team2', name: 'Solar Flares', coachId: 'coach456' },
];

export const mockPlayers: Player[] = [
  {
    id: 'p1',
    name: 'Leo Vega',
    teamId: 'team1',
    position: 'Striker',
    stats: { goals: 2, assists: 1, minutesPlayed: 90, yellowCards: 0, redCards: 0 },
    imageUrl: 'https://via.placeholder.com/280x250/8a2be2/FFF?text=Leo+Vega',
  },
  {
    id: 'p2',
    name: 'Mia Chen',
    teamId: 'team1',
    position: 'Midfielder',
    stats: { goals: 0, assists: 3, minutesPlayed: 90, yellowCards: 1, redCards: 0 },
    imageUrl: 'https://via.placeholder.com/280x250/333/FFF?text=Mia+Chen',
  },
  {
    id: 'p3',
    name: 'Sam Jones',
    teamId: 'team2',
    position: 'Defender',
    stats: { goals: 0, assists: 0, minutesPlayed: 75, yellowCards: 0, redCards: 0 },
    imageUrl: 'https://via.placeholder.com/280x250/555/FFF?text=Sam+Jones',
  },
];