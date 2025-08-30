// src/pages/coachDashboard/team-stats-helper.ts
import type{ Match } from '../../../types';

export const calculateTeamStats = (matches: Match[]) => {
  if (matches.length === 0) return null;

  const totalMatches = matches.length;
  const wins = matches.filter(m => m.teamScore > m.opponentScore).length;
  const draws = matches.filter(m => m.teamScore === m.opponentScore).length;
  const losses = totalMatches - wins - draws;

  const goalsFor = matches.reduce((sum, m) => sum + m.teamScore, 0);
  const goalsAgainst = matches.reduce((sum, m) => sum + m.opponentScore, 0);
  const goalDifference = goalsFor - goalsAgainst;

  const totalShots = matches.reduce((sum, m) => sum + (m.shots || 0), 0);
  const totalPossession = matches.reduce((sum, m) => sum + (m.possession || 0), 0);
  const totalFouls = matches.reduce((sum, m) => sum + (m.fouls || 0), 0);

  // Form is the result of the last 5 matches (W, D, L)
  const form = matches.slice(0, 5).map(m => {
    if (m.teamScore > m.opponentScore) return 'W';
    if (m.teamScore < m.opponentScore) return 'L';
    return 'D';
  });

  return {
    totalMatches,
    wins,
    draws,
    losses,
    winPercentage: totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0,
    goalsFor,
    goalsAgainst,
    goalDifference,
    avgGoalsFor: totalMatches > 0 ? (goalsFor / totalMatches).toFixed(2) : 0,
    avgGoalsAgainst: totalMatches > 0 ? (goalsAgainst / totalMatches).toFixed(2) : 0,
    avgShots: totalMatches > 0 ? (totalShots / totalMatches).toFixed(2) : 0,
    avgPossession: totalMatches > 0 ? Math.round(totalPossession / totalMatches) : 0,
    avgFouls: totalMatches > 0 ? (totalFouls / totalMatches).toFixed(2) : 0,
    form,
  };
};