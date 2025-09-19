import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CoachDashboard from '../pages/coachDashboard/CoachDashboard';
import { getCurrentTeamId, setCurrentTeamId, fetchTeamByCoachId } from '../services/teamService';
import supabase from '../../supabaseClient';

// Create mock navigate function
const mockNavigate = vi.fn();

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock child components
vi.mock('../pages/coachDashboard/DashboardSidebar', () => ({
  default: ({ onNavigate }: { onNavigate: (tab: string) => void }) => (
    <div data-testid="dashboard-sidebar">
      <button data-testid="players-btn" onClick={() => onNavigate('players')}>Players</button>
      <button data-testid="matches-btn" onClick={() => onNavigate('matches')}>Matches</button>
      <button data-testid="myteam-btn" onClick={() => onNavigate('myTeam')}>My Team</button>
    </div>
  ),
}));

vi.mock('../pages/coachDashboard/coachStatsPage/MyTeamTab', () => ({
  default: () => <div data-testid="my-team-tab">My Team Content</div>,
}));

vi.mock('../pages/coachDashboard/matchManaging/MatchesPage', () => ({
  default: () => <div data-testid="matches-page">Matches Content</div>,
}));

vi.mock('../pages/coachDashboard/playerManagement/PlayerManagementPage', () => ({
  default: () => <div data-testid="player-management-page">Player Management Content</div>,
}));

// Mock services
vi.mock('../services/teamService', () => ({
  getCurrentTeamId: vi.fn(),
  setCurrentTeamId: vi.fn(),
  fetchTeamByCoachId: vi.fn(),
}));

vi.mock('../../supabaseClient', () => ({
  default: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));


// Mock CSS import
vi.mock('../Styles/coach-dashboard.css', () => ({}));

describe('CoachDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const renderCoachDashboard = () => {
    return render(<CoachDashboard />);
  };

  describe('Component Rendering', () => {
    it('renders the dashboard structure correctly', () => {
      vi.mocked(getCurrentTeamId).mockReturnValue('team-123');
      
      renderCoachDashboard();
      
      expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
      expect(document.querySelector('.dashboard-content')).toBeInTheDocument();
    });

    it('renders PlayerManagementPage by default', () => {
      vi.mocked(getCurrentTeamId).mockReturnValue('team-123');
      
      renderCoachDashboard();
      
      expect(screen.getByTestId('player-management-page')).toBeInTheDocument();
      expect(screen.queryByTestId('matches-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('my-team-tab')).not.toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('switches to matches tab when sidebar navigates to matches', async () => {
      vi.mocked(getCurrentTeamId).mockReturnValue('team-123');
      
      renderCoachDashboard();
      
      const matchesButton = screen.getByTestId('matches-btn');
      fireEvent.click(matchesButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('matches-page')).toBeInTheDocument();
      });
      
      expect(screen.queryByTestId('player-management-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('my-team-tab')).not.toBeInTheDocument();
    });

    it('switches to myTeam tab when sidebar navigates to myTeam', async () => {
      vi.mocked(getCurrentTeamId).mockReturnValue('team-123');
      
      renderCoachDashboard();
      
      const myTeamButton = screen.getByTestId('myteam-btn');
      fireEvent.click(myTeamButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('my-team-tab')).toBeInTheDocument();
      });
      
      expect(screen.queryByTestId('player-management-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('matches-page')).not.toBeInTheDocument();
    });

    it('switches back to players tab', async () => {
      vi.mocked(getCurrentTeamId).mockReturnValue('team-123');
      
      renderCoachDashboard();
      
      // First switch to matches
      const matchesButton = screen.getByTestId('matches-btn');
      fireEvent.click(matchesButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('matches-page')).toBeInTheDocument();
      });
      
      // Then switch back to players
      const playersButton = screen.getByTestId('players-btn');
      fireEvent.click(playersButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('player-management-page')).toBeInTheDocument();
      });
      
      expect(screen.queryByTestId('matches-page')).not.toBeInTheDocument();
    });
  });

  describe('Team Management Logic', () => {
    it('does nothing when team ID already exists', async () => {
      vi.mocked(getCurrentTeamId).mockReturnValue('existing-team-123');
      
      renderCoachDashboard();
      
      await waitFor(() => {
        expect(getCurrentTeamId).toHaveBeenCalled();
      });
      
      expect(supabase.auth.getSession).not.toHaveBeenCalled();
      expect(fetchTeamByCoachId).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('redirects to login when no user session exists', async () => {
      vi.mocked(getCurrentTeamId).mockReturnValue(null);
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);
      
      renderCoachDashboard();
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
      
      expect(fetchTeamByCoachId).not.toHaveBeenCalled();
    });

    it('sets team ID when coach has an existing team', async () => {
      const mockUserId = 'coach-user-123';
      const mockTeamId = 'team-456';
      
      vi.mocked(getCurrentTeamId).mockReturnValue(null);
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { 
          session: { 
            user: { id: mockUserId },
          },
        },
        error: null,
      } as any);
      vi.mocked(fetchTeamByCoachId).mockResolvedValue({ id: mockTeamId } as any);
      
      renderCoachDashboard();
      
      await waitFor(() => {
        expect(fetchTeamByCoachId).toHaveBeenCalledWith(mockUserId);
      });
      
      await waitFor(() => {
        expect(setCurrentTeamId).toHaveBeenCalledWith(mockTeamId);
      });
      
      expect(mockNavigate).not.toHaveBeenCalledWith('/team-setup');
    });

    it('redirects to team setup when coach has no team', async () => {
      const mockUserId = 'coach-user-123';
      
      vi.mocked(getCurrentTeamId).mockReturnValue(null);
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { 
          session: { 
            user: { id: mockUserId },
          },
        },
        error: null,
      } as any);
      vi.mocked(fetchTeamByCoachId).mockResolvedValue(null);
      
      renderCoachDashboard();
      
      await waitFor(() => {
        expect(fetchTeamByCoachId).toHaveBeenCalledWith(mockUserId);
      });
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/team-setup');
      });
      
      expect(setCurrentTeamId).not.toHaveBeenCalled();
    });

    it('redirects to team setup when team has no ID', async () => {
      const mockUserId = 'coach-user-123';
      
      vi.mocked(getCurrentTeamId).mockReturnValue(null);
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { 
          session: { 
            user: { id: mockUserId },
          },
        },
        error: null,
      } as any);
      vi.mocked(fetchTeamByCoachId).mockResolvedValue({ id: null } as any);
      
      renderCoachDashboard();
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/team-setup');
      });
      
      expect(setCurrentTeamId).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('handles session fetch errors gracefully', async () => {
      vi.mocked(getCurrentTeamId).mockReturnValue(null);
      vi.mocked(supabase.auth.getSession).mockRejectedValue(new Error('Session error'));
      
      renderCoachDashboard();
      
      // Component should still render even if session fetch fails
      expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('player-management-page')).toBeInTheDocument();
    });

    it('handles team fetch errors gracefully', async () => {
      const mockUserId = 'coach-user-123';
      
      vi.mocked(getCurrentTeamId).mockReturnValue(null);
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { 
          session: { 
            user: { id: mockUserId },
          },
        },
        error: null,
      } as any);
      vi.mocked(fetchTeamByCoachId).mockRejectedValue(new Error('Team fetch error'));
      
      renderCoachDashboard();
      
      // Component should still render even if team fetch fails
      expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('player-management-page')).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes to dashboard elements', () => {
      vi.mocked(getCurrentTeamId).mockReturnValue('team-123');
      
      const { container } = renderCoachDashboard();
      
      const dashboardSection = container.querySelector('.dashboard.coach-dashboard');
      expect(dashboardSection).toBeInTheDocument();
      
      const contentSection = container.querySelector('.dashboard-content');
      expect(contentSection).toBeInTheDocument();
    });
  });
});