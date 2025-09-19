import { describe, it, expect } from 'vitest';
import { getPlayerKeyStats, getPositionSpecificStats } from '../pages/coachDashboard/playerManagement/stats-helper';
import type { Player } from '../types';

describe('stats-helper.ts', () => {

  const baseStats = {
    goals: 5,
    assists: 3,
    yellowCards: 2,
    redCards: 0,
    minutesPlayed: 450,
    saves: 10,
    savePercentage: 80,
    cleansheets: 4,
    clearances: 15,
    tackles: 20,
    interceptions: 8,
    passCompletion: 75,
    shots: 10,
    shotsOnTarget: 7,
    dribblesAttempted: 5,
    dribblesSuccessful: 3,
    offsides: 2
  };

  const makePlayer = (position: string, overrides = {}): Player => ({
    id: '1',
    name: 'Test Player',
    position,
    stats: {
      ...baseStats,
      ...overrides,
      chancesCreated: 0,
      performanceData: []
    },
    teamId: '',
    jerseyNum: '',
    imageUrl: ''
  });

  //UNIT TESTS

  describe('getPlayerKeyStats', () => {
    it('should return correct key stats for GK', () => {
      const player = makePlayer('GK');
      const { keyStats, chartStat } = getPlayerKeyStats(player);
      expect(keyStats).toEqual([
        { label: 'Saves', value: 10 },
        { label: 'Save %', value: '80%' },
        { label: 'Clean Sheets', value: 4 }
      ]);
      expect(chartStat).toEqual({ label: 'Saves', dataKey: 'saves' });
    });

    it('should return correct key stats for DEF', () => {
      const player = makePlayer('DEF');
      const { keyStats, chartStat } = getPlayerKeyStats(player);
      expect(keyStats).toEqual([
        { label: 'Tackles', value: 20 },
        { label: 'Interceptions', value: 8 },
        { label: 'Pass %', value: '75%' }
      ]);
      expect(chartStat).toEqual({ label: 'Tackles', dataKey: 'tackles' });
    });

    it('should return correct key stats for MID', () => {
      const player = makePlayer('MID');
      const { keyStats, chartStat } = getPlayerKeyStats(player);
      expect(keyStats).toEqual([
        { label: 'Goals', value: 5 },
        { label: 'Assists', value: 3 },
        { label: 'Pass %', value: '75%' }
      ]);
      expect(chartStat).toEqual({ label: 'Pass Completion', dataKey: 'passCompletion' });
    });

    it('should return correct key stats for STR with shot accuracy', () => {
      const player = makePlayer('STR');
      const { keyStats, chartStat } = getPlayerKeyStats(player);
      expect(keyStats).toEqual([
        { label: 'Goals', value: 5 },
        { label: 'Shots', value: 10 },
        { label: 'Shot Accuracy', value: '70%' }
      ]);
      expect(chartStat).toEqual({ label: 'Goals', dataKey: 'goals' });
    });

    it('should handle STR with zero shots correctly', () => {
      const player = makePlayer('STR', { shots: 0, shotsOnTarget: 0 });
      const { keyStats } = getPlayerKeyStats(player);
      expect(keyStats.find(s => s.label === 'Shot Accuracy')?.value).toBe('0%');
    });

    it('should fallback for unknown positions', () => {
      const player = makePlayer('UNKNOWN');
      const { keyStats, chartStat } = getPlayerKeyStats(player);
      expect(keyStats).toEqual([
        { label: 'Goals', value: 5 },
        { label: 'Assists', value: 3 },
        { label: 'Minutes', value: 450 }
      ]);
      expect(chartStat).toEqual({ label: 'Goals', dataKey: 'goals' });
    });
  });

  //EDGE TESTS 

  describe('getPositionSpecificStats', () => {
    it('should calculate dribble success rate correctly for MID', () => {
      const player = makePlayer('MID', { dribblesAttempted: 4, dribblesSuccessful: 2 });
      const { positionStats } = getPositionSpecificStats(player);
      const dribbleStat = positionStats.find(s => s.label === 'Dribble Success Rate');
      expect(dribbleStat?.value).toBe('50%');
    });

    it('should handle zero dribbles for MID without error', () => {
      const player = makePlayer('MID', { dribblesAttempted: 0, dribblesSuccessful: 0 });
      const { positionStats } = getPositionSpecificStats(player);
      const dribbleStat = positionStats.find(s => s.label === 'Dribble Success Rate');
      expect(dribbleStat?.value).toBe('0%');
    });

    it('should calculate shot accuracy correctly for STR', () => {
      const player = makePlayer('STR', { shots: 8, shotsOnTarget: 4 });
      const { positionStats } = getPositionSpecificStats(player);
      const shotAccuracy = positionStats.find(s => s.label === 'Shot Accuracy');
      expect(shotAccuracy?.value).toBe('50%');
    });

    it('should handle zero shots for STR without error', () => {
      const player = makePlayer('STR', { shots: 0, shotsOnTarget: 0 });
      const { positionStats } = getPositionSpecificStats(player);
      const shotAccuracy = positionStats.find(s => s.label === 'Shot Accuracy');
      expect(shotAccuracy?.value).toBe('0%');
    });

    it('should include general stats', () => {
      const player = makePlayer('DEF');
      const { generalStats } = getPositionSpecificStats(player);
      expect(generalStats.map(s => s.label)).toEqual([
        'Goals', 'Assists', 'Yellow Cards', 'Red Cards', 'Minutes Played'
      ]);
    });
  });

});
