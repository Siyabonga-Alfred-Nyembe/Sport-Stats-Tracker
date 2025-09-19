import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import PlayerStatsModal from '../pages/coachDashboard/playerManagement/PlayerStatsModal';
import * as statsHelper from '../pages/coachDashboard/playerManagement//stats-helper';
import type { Player } from '../types';

// Mock external dependencies
vi.mock('jspdf');
vi.mock('html2canvas');

vi.mock('../pages/coachDashboard/playerManagement/KeyStatCard', () => ({
  default: ({ label, value }: { label: string; value: string }) => (
    <div data-testid="key-stat-card">{label}: {value}</div>
  )
}));

vi.mock('../pages/coachDashboard/playerManagement/StatsChart', () => ({
  default: ({ data }: { data: any[] }) => (
    <div data-testid="stats-chart">Chart with {data?.length || 0} data points</div>
  )
}));

vi.mock('../pages/coachDashboard/playerManagement/StatsTable', () => ({
  default: ({ player }: { player: Player }) => (
    <div data-testid="stats-table">Stats for {player.name}</div>
  )
}));

vi.mock('../pages/coachDashboard/playerManagement/stats-helper');

vi.mock('../../supabaseClient', () => ({
  default: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn()
      })),
      delete: vi.fn(() => ({
        eq: vi.fn()
      }))
    }))
  }
}));

const mockTeamId = 'team-123';

// Mock player data matching your structure
const mockPlayer: Player = {
  id: 'player-1',
  name: 'John Doe',
  position: 'Forward',
  jerseyNum: "10",
  teamId: mockTeamId,
  imageUrl: 'https://example.com/avatar1.png',
  stats: {
    goals: 15,
    assists: 8,
    yellowCards: 2,
    redCards: 0,
    shots: 25,
    shotsOnTarget: 18,
    chancesCreated: 12,
    dribblesAttempted: 30,
    dribblesSuccessful: 22,
    offsides: 3,
    tackles: 45,
    interceptions: 15,
    clearances: 8,
    saves: 0,
    cleansheets: 0,
    savePercentage: 0,
    passCompletion: 85,
    minutesPlayed: 1250,
    performanceData: [0, 0, 0, 0, 0]
  }
};

const mockPlayers: Player[] = [
  {
    id: 'player-1',
    name: 'John Doe',
    position: 'Forward',
    jerseyNum: "10",
    teamId: mockTeamId,
    imageUrl: 'https://example.com/avatar1.png',
    stats: {
      goals: 15,
      assists: 8,
      yellowCards: 2,
      redCards: 0,
      shots: 0,
      shotsOnTarget: 0,
      chancesCreated: 0,
      dribblesAttempted: 0,
      dribblesSuccessful: 0,
      offsides: 0,
      tackles: 0,
      interceptions: 0,
      clearances: 0,
      saves: 0,
      cleansheets: 0,
      savePercentage: 0,
      passCompletion: 0,
      minutesPlayed: 0,
      performanceData: []
    }
  },
  {
    id: 'player-2',
    name: 'Jane Smith',
    position: 'Midfielder',
    jerseyNum: "8",
    teamId: mockTeamId,
    imageUrl: 'https://example.com/avatar2.png',
    stats: {
      goals: 5,
      assists: 12,
      yellowCards: 1,
      redCards: 0,
      shots: 0,
      shotsOnTarget: 0,
      chancesCreated: 0,
      dribblesAttempted: 0,
      dribblesSuccessful: 0,
      offsides: 0,
      tackles: 0,
      interceptions: 0,
      clearances: 0,
      saves: 0,
      cleansheets: 0,
      savePercentage: 0,
      passCompletion: 0,
      minutesPlayed: 0,
      performanceData: []
    }
  }
];


describe('PlayerStatsModal', () => {
  const mockOnClose = vi.fn();
  const mockStatsHelper = vi.mocked(statsHelper);

//   beforeEach(() => {
//     vi.clearAllMocks();
//     mockStatsHelper.getPlayerKeyStats.mockReturnValue({
//       keyStats: mockKeyStats,
//       chartStat: mockChartStat
//     });
//   });

  afterEach(() => {
    vi.clearAllTimers();
  });


  // Edge Cases
  describe('Edge Cases', () => {

    it('handles empty performance data', () => {
      mockStatsHelper.getPlayerKeyStats.mockReturnValue({
        keyStats: [],
        chartStat: {
            label: 'No Data',
            dataKey: ''
        }
      });

      const playerWithNoData = {
        ...mockPlayer,
        stats: { ...mockPlayer.stats, performanceData: [] }
      };

      render(<PlayerStatsModal player={playerWithNoData} onClose={mockOnClose} />);

      expect(screen.getByText('No Data over Last 5 Matches')).toBeInTheDocument();
      expect(screen.getByText('Chart with 0 data points')).toBeInTheDocument();
    });

    it('handles very long player names', () => {
      const playerWithLongName = {
        ...mockPlayer,
        name: 'A'.repeat(100)
      };

      render(<PlayerStatsModal player={playerWithLongName} onClose={mockOnClose} />);

      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });

    it('handles jersey number as string', () => {
      const playerWithStringJersey = { ...mockPlayer, jerseyNum: "99" };
      render(<PlayerStatsModal player={playerWithStringJersey} onClose={mockOnClose} />);

      expect(screen.getByText('Forward | #99')).toBeInTheDocument();
    });

    it('handles missing stats helper data', () => {
      mockStatsHelper.getPlayerKeyStats.mockReturnValue({
        keyStats: [],
        chartStat: {
            label: 'Unknown',
            dataKey: ''
        }
      });

      render(<PlayerStatsModal player={mockPlayer} onClose={mockOnClose} />);

      expect(screen.queryByTestId('key-stat-card')).not.toBeInTheDocument();
      expect(screen.getByText('Unknown over Last 5 Matches')).toBeInTheDocument();
    });

    it('handles players with goalkeeper stats', () => {
      const goalkeeperPlayer = {
        ...mockPlayer,
        position: 'Goalkeeper',
        stats: {
          ...mockPlayer.stats,
          saves: 45,
          cleansheets: 8,
          savePercentage: 75
        }
      };

      mockStatsHelper.getPlayerKeyStats.mockReturnValue({
        keyStats: [
          { label: 'Saves', value: '45' },
          { label: 'Clean Sheets', value: '8' },
          { label: 'Save %', value: '75%' }
        ],
        chartStat: {
            label: 'Saves',
            dataKey: ''
        }
      });

      render(<PlayerStatsModal player={goalkeeperPlayer} onClose={mockOnClose} />);

      expect(screen.getByText('Saves: 45')).toBeInTheDocument();
      expect(screen.getByText('Clean Sheets: 8')).toBeInTheDocument();
    });
  });

  // Integration Tests
  describe('Integration Tests', () => {

    it('passes correct data to child components', () => {
      render(<PlayerStatsModal player={mockPlayer} onClose={mockOnClose} />);

      // Verify StatsChart receives performance data
      expect(screen.getByText('Chart with 5 data points')).toBeInTheDocument();

      // Verify StatsTable receives player object
      expect(screen.getByText('Stats for John Doe')).toBeInTheDocument();
    });

    it('handles modal lifecycle correctly', async () => {
      const { rerender, unmount } = render(
        <PlayerStatsModal player={mockPlayer} onClose={mockOnClose} />
      );

      // Modal should be visible
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      // Update player data
      const updatedPlayer = { ...mockPlayer, name: 'Jane Doe' };
      rerender(<PlayerStatsModal player={updatedPlayer} onClose={mockOnClose} />);

      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();

      // Unmount should not cause errors
      unmount();
    });

    it('works with multiple players from mock data', () => {
      // Test with first player from mockPlayers array
      render(<PlayerStatsModal player={mockPlayers[0]} onClose={mockOnClose} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Forward | #10')).toBeInTheDocument();

      // Test switching to second player
      const { rerender } = render(
        <PlayerStatsModal player={mockPlayers[1]} onClose={mockOnClose} />
      );
      
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Midfielder | #8')).toBeInTheDocument();
    });

    it('handles team context correctly', () => {
      const playerWithTeam = { ...mockPlayer, teamId: mockTeamId };
      render(<PlayerStatsModal player={playerWithTeam} onClose={mockOnClose} />);

      expect(mockStatsHelper.getPlayerKeyStats).toHaveBeenCalledWith(
        expect.objectContaining({ teamId: mockTeamId })
      );
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<PlayerStatsModal player={mockPlayer} onClose={mockOnClose} />);

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('John Doe');

      const subHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(subHeadings).toHaveLength(2);
    });

    it('has accessible image alt text', () => {
      render(<PlayerStatsModal player={mockPlayer} onClose={mockOnClose} />);

      const playerImage = screen.getByAltText('John Doe');
      expect(playerImage).toBeInTheDocument();
    });
  });

});