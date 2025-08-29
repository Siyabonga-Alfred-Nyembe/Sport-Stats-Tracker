// pages/userDashboard/types.ts
export interface Team { id: string; name: string; isFavorite?: boolean; }
export interface Player { id: string; name: string; teamId: string; position: string; stats: { goals: number; assists: number; minutesPlayed: number }; }
export interface Match { id: string; homeTeamId: string; awayTeamId: string; homeScore: number; awayScore: number; date: string; status: "confirmed" | "pending" | "finished"; }
