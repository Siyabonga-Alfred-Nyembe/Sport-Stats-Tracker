// src/components/PlayerManagement/stats-helper.ts
import type { Player } from '../../../types';

const positionGroups = {
  GK: ['GK'],
  DEF: ['DEF', 'RB', 'LB', 'CDM'],
  MID: ['MID', 'CAM', 'ATM', 'FW'],
  FWD: ['ST', 'LW', 'RW']
};

export const getPlayerKeyStats = (player: Player) => {
  const { stats, position } = player;
  let keyStats = [];
  let chartStat = { label: 'Performance', dataKey: '' };

  if (positionGroups.GK.includes(position)) {
    keyStats = [
      { label: 'Saves', value: stats.saves },
      { label: 'Save %', value: `${stats.savePercentage}%` },
      { label: 'Cleansheets', value: stats.cleansheets }
    ];
    chartStat = { label: 'Saves', dataKey: 'saves' };
  } else if (positionGroups.DEF.includes(position)) {
    keyStats = [
      { label: 'Tackles', value: stats.tackles },
      { label: 'Interceptions', value: stats.interceptions },
      { label: 'Pass %', value: `${stats.passCompletion}%` }
    ];
    chartStat = { label: 'Tackles', dataKey: 'tackles' };
  } else if (positionGroups.MID.includes(position)) {
     keyStats = [
      { label: 'Goals', value: stats.goals },
      { label: 'Assists', value: stats.assists },
      { label: 'Chances Created', value: stats.chancesCreated }
    ];
    chartStat = { label: 'Assists', dataKey: 'assists' };
  } else { // Forwards
    keyStats = [
      { label: 'Goals', value: stats.goals },
      { label: 'Assists', value: stats.assists },
      { label: 'Shots', value: stats.shots }
    ];
    chartStat = { label: 'Goals', dataKey: 'goals' };
  }

  return { keyStats, chartStat };
};