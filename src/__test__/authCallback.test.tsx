import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthCallback from '../pages/authCallback';
import { getUserRole, createUserProfile, checkUserExists } from '../services/roleService';
import supabase from '../../supabaseClient';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../../supabaseClient', () => ({
  default: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('../services/roleService', () => ({
  getUserRole: vi.fn(),
  createUserProfile: vi.fn(),
  checkUserExists: vi.fn(),
}));

vi.mock('../components/RoleSelection', () => ({
  default: ({ onRoleSelected, userId, userEmail }: any) => (
    <div data-testid="role-selection">
      <div>Role Selection Component</div>
      <div>User ID: {userId}</div>
      <div>User Email: {userEmail}</div>
      <button onClick={() => onRoleSelected('Fan')}>Select Fan</button>
      <button onClick={() => onRoleSelected('Coach')}>Select Coach</button>
    </div>
  ),
}));

// Mock console methods
const consoleSpy = {
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
};

// Import mocked modules
import { useNavigate } from 'react-router-dom';

// Type assertions for mocked modules
const mockNavigate = useNavigate as any;
const mockSupabase = supabase as any;
const mockGetUserRole = getUserRole as any;
const mockCreateUserProfile = createUserProfile as any;
const mockCheckUserExists = checkUserExists as any;

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('AuthCallback Component', () => {
  const mockNavigateFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy.error.mockClear();
    mockNavigate.mockReturnValue(mockNavigateFn);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Unit Tests', () => {
    describe('Initial Loading State', () => {
      it('should display loading message initially', () => {
        // Mock pending session
        mockSupabase.auth.getSession.mockReturnValue(new Promise(() => {}));

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });

    describe('Session Error Handling', () => {

      it('should navigate to login when no session exists', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: null },
          error: null,
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(mockNavigateFn).toHaveBeenCalledWith('/login');
        });
      });

      it('should navigate to login when session user is null', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: { user: null } },
          error: null,
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(mockNavigateFn).toHaveBeenCalledWith('/login');
        });
      });
    });

    describe('Existing User Scenarios', () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      const mockSession = {
        user: mockUser,
      };

      it('should redirect existing coach to coach dashboard', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockGetUserRole.mockResolvedValue({
          id: mockUser.id,
          email: mockUser.email,
          role: 'Coach',
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(mockGetUserRole).toHaveBeenCalledWith(mockUser.id);
          expect(mockNavigateFn).toHaveBeenCalledWith('/coach-dashboard', {
            state: {
              username: mockUser.email,
              userId: mockUser.id,
              isGoogleUser: true,
            },
          });
        });
      });

      it('should redirect existing fan to user dashboard', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockGetUserRole.mockResolvedValue({
          id: mockUser.id,
          email: mockUser.email,
          role: 'Fan',
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(mockGetUserRole).toHaveBeenCalledWith(mockUser.id);
          expect(mockNavigateFn).toHaveBeenCalledWith('/user-dashboard', {
            state: {
              username: mockUser.email,
              userId: mockUser.id,
              isGoogleUser: true,
            },
          });
        });
      });

      it('should handle user with unknown email', async () => {
        const userWithoutEmail = {
          id: 'user-123',
          email: null,
        };

        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: { user: userWithoutEmail } },
          error: null,
        });

        mockGetUserRole.mockResolvedValue(null);

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(screen.getByText('User Email: Unknown')).toBeInTheDocument();
        });
      });
    });

    describe('Duplicate Account Prevention', () => {
      const mockUser = {
        id: 'user-123',
        email: 'existing@example.com',
      };

      const mockSession = {
        user: mockUser,
      };

      beforeEach(() => {
        // Mock localStorage for cameFromSignup
        Object.defineProperty(window, 'localStorage', {
          value: {
            getItem: vi.fn().mockReturnValue('1'),
            removeItem: vi.fn(),
          },
          writable: true,
        });

        // Mock URLSearchParams to simulate coming from signup
        Object.defineProperty(window, 'location', {
          value: {
            href: 'http://localhost:3000/auth-callback?from=signup',
            origin: 'http://localhost:3000',
            search: '?from=signup',
          },
          writable: true,
        });
      });

      it('should show existing account message for Coach user trying to sign up again', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockCheckUserExists.mockResolvedValue({
          exists: true,
          role: 'Coach'
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(mockCheckUserExists).toHaveBeenCalledWith(mockUser.email);
          expect(screen.getByText('Account Already Exists')).toBeInTheDocument();
          expect(screen.getByText('You already have an account as a Coach. Please sign in instead.')).toBeInTheDocument();
          expect(screen.getByText('Go to Sign In Now')).toBeInTheDocument();
        });
      });

      it('should show existing account message for Fan user trying to sign up again', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockCheckUserExists.mockResolvedValue({
          exists: true,
          role: 'Fan'
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(screen.getByText('You already have an account as a Fan. Please sign in instead.')).toBeInTheDocument();
        });
      });

      it('should show existing account message for Admin user trying to sign up again', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockCheckUserExists.mockResolvedValue({
          exists: true,
          role: 'Admin'
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(screen.getByText('You already have an account as a Admin. Please sign in instead.')).toBeInTheDocument();
        });
      });

      it('should redirect to login after 3 seconds when existing account detected', async () => {
        vi.useFakeTimers();
        
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockCheckUserExists.mockResolvedValue({
          exists: true,
          role: 'Coach'
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(screen.getByText('Account Already Exists')).toBeInTheDocument();
        });

        // Fast-forward time by 3 seconds
        vi.advanceTimersByTime(3000);

        await waitFor(() => {
          expect(mockNavigateFn).toHaveBeenCalledWith('/login');
        });

        vi.useRealTimers();
      });

      it('should allow immediate navigation to login when button is clicked', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockCheckUserExists.mockResolvedValue({
          exists: true,
          role: 'Coach'
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(screen.getByText('Account Already Exists')).toBeInTheDocument();
        });

        const signInButton = screen.getByText('Go to Sign In Now');
        signInButton.click();

        expect(mockNavigateFn).toHaveBeenCalledWith('/login');
      });

      it('should proceed with role selection when no existing account is found during signup', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockCheckUserExists.mockResolvedValue({
          exists: false
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(mockCheckUserExists).toHaveBeenCalledWith(mockUser.email);
          expect(screen.getByTestId('role-selection')).toBeInTheDocument();
        });

        // Should not show existing account message
        expect(screen.queryByText('Account Already Exists')).not.toBeInTheDocument();
      });

      it('should proceed with role selection when user exists but has no role during signup', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockCheckUserExists.mockResolvedValue({
          exists: true,
          role: undefined // User exists but has no role
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(mockCheckUserExists).toHaveBeenCalledWith(mockUser.email);
          expect(screen.getByTestId('role-selection')).toBeInTheDocument();
        });

        // Should not show existing account message
        expect(screen.queryByText('Account Already Exists')).not.toBeInTheDocument();
      });
    });

    describe('Sign-in Scenarios', () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      const mockSession = {
        user: mockUser,
      };

      beforeEach(() => {
        // Mock URLSearchParams to simulate coming from login (no from=signup param)
        Object.defineProperty(window, 'location', {
          value: {
            href: 'http://localhost:3000/auth-callback',
            origin: 'http://localhost:3000',
            search: '',
          },
          writable: true,
        });

        // Mock localStorage to not have cameFromSignup
        Object.defineProperty(window, 'localStorage', {
          value: {
            getItem: vi.fn().mockReturnValue(null),
            removeItem: vi.fn(),
          },
          writable: true,
        });
      });

      it('should show no account message when user tries to sign in without an account', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockCheckUserExists.mockResolvedValue({
          exists: false
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(mockCheckUserExists).toHaveBeenCalledWith(mockUser.email);
          expect(screen.getByText('No Account Found')).toBeInTheDocument();
          expect(screen.getByText("You don't have an account yet. Please sign up first before you can sign in.")).toBeInTheDocument();
          expect(screen.getByText('Go to Sign Up Now')).toBeInTheDocument();
        });
      });

      it('should redirect to signup after 3 seconds when no account found during sign-in', async () => {
        vi.useFakeTimers();
        
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockCheckUserExists.mockResolvedValue({
          exists: false
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(screen.getByText('No Account Found')).toBeInTheDocument();
        });

        // Fast-forward time by 3 seconds
        vi.advanceTimersByTime(3000);

        await waitFor(() => {
          expect(mockNavigateFn).toHaveBeenCalledWith('/signup');
        });

        vi.useRealTimers();
      });

      it('should allow immediate navigation to signup when button is clicked', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockCheckUserExists.mockResolvedValue({
          exists: false
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(screen.getByText('No Account Found')).toBeInTheDocument();
        });

        const signUpButton = screen.getByText('Go to Sign Up Now');
        signUpButton.click();

        expect(mockNavigateFn).toHaveBeenCalledWith('/signup');
      });

      it('should proceed with normal login flow when user exists during sign-in', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockCheckUserExists.mockResolvedValue({
          exists: true,
          role: 'Fan'
        });

        mockGetUserRole.mockResolvedValue({
          id: mockUser.id,
          email: mockUser.email,
          role: 'Fan',
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(mockCheckUserExists).toHaveBeenCalledWith(mockUser.email);
          expect(mockGetUserRole).toHaveBeenCalledWith(mockUser.id);
          expect(mockNavigateFn).toHaveBeenCalledWith('/user-dashboard', {
            state: {
              username: mockUser.email,
              userId: mockUser.id,
              isGoogleUser: true,
            },
          });
        });

        // Should not show no account message
        expect(screen.queryByText('No Account Found')).not.toBeInTheDocument();
      });
    });

    describe('New User Scenarios', () => {
      const mockUser = {
        id: 'new-user-123',
        email: 'newuser@example.com',
      };

      const mockSession = {
        user: mockUser,
      };

      it('should show role selection for new user', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockGetUserRole.mockResolvedValue(null);

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(screen.getByTestId('role-selection')).toBeInTheDocument();
          expect(screen.getByText('Role Selection Component')).toBeInTheDocument();
          expect(screen.getByText(`User ID: ${mockUser.id}`)).toBeInTheDocument();
          expect(screen.getByText(`User Email: ${mockUser.email}`)).toBeInTheDocument();
        });
      });

      it('should not call navigate when showing role selection', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });

        mockGetUserRole.mockResolvedValue(null);

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(screen.getByTestId('role-selection')).toBeInTheDocument();
        });

        // Should not have navigated anywhere yet
        expect(mockNavigateFn).not.toHaveBeenCalled();
      });
    });

  });

  describe('Integration Tests', () => {
    describe('Role Selection Workflow', () => {
      const mockUser = {
        id: 'new-user-123',
        email: 'newuser@example.com',
      };

      const mockSession = {
        user: mockUser,
      };

      beforeEach(() => {
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: mockSession },
          error: null,
        });
        
        mockGetUserRole.mockResolvedValue(null); // New user
      });

      it('should handle successful fan role selection', async () => {
        mockCreateUserProfile.mockResolvedValue(true);

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(screen.getByTestId('role-selection')).toBeInTheDocument();
        });

        // Click fan role selection
        const fanButton = screen.getByText('Select Fan');
        fanButton.click();

        await waitFor(() => {
          expect(mockCreateUserProfile).toHaveBeenCalledWith(mockUser.id, mockUser.email, 'Fan');
          expect(mockNavigateFn).toHaveBeenCalledWith('/user-dashboard');
        });
      });

      it('should handle successful coach role selection', async () => {
        mockCreateUserProfile.mockResolvedValue(true);

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(screen.getByTestId('role-selection')).toBeInTheDocument();
        });

        // Click coach role selection
        const coachButton = screen.getByText('Select Coach');
        coachButton.click();

        await waitFor(() => {
          expect(mockCreateUserProfile).toHaveBeenCalledWith(mockUser.id, mockUser.email, 'Coach');
          expect(mockNavigateFn).toHaveBeenCalledWith('/team-setup');
        });
      });

      it('should not handle role selection without userData', async () => {
        // Mock a scenario where userData is null (edge case)
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: { user: null } },
          error: null,
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(mockNavigateFn).toHaveBeenCalledWith('/login');
        });

        // Since there's no userData, role selection should not be shown
        expect(screen.queryByTestId('role-selection')).not.toBeInTheDocument();
      });
    });

    describe('Complete Authentication Flow', () => {
      it('should handle complete new user onboarding flow', async () => {
        const mockUser = {
          id: 'complete-user-123',
          email: 'complete@example.com',
        };

        // Step 1: Initial session check
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: { user: mockUser } },
          error: null,
        });

        // Step 2: User doesn't exist in database
        mockGetUserRole.mockResolvedValue(null);

        // Step 3: Profile creation succeeds
        mockCreateUserProfile.mockResolvedValue(true);

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        // Initial loading
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        // Wait for role selection to appear
        await waitFor(() => {
          expect(screen.getByTestId('role-selection')).toBeInTheDocument();
          expect(screen.getByText(`User ID: ${mockUser.id}`)).toBeInTheDocument();
          expect(screen.getByText(`User Email: ${mockUser.email}`)).toBeInTheDocument();
        });

        // Select coach role
        const coachButton = screen.getByText('Select Coach');
        coachButton.click();

        // Verify complete flow
        await waitFor(() => {
          expect(mockSupabase.auth.getSession).toHaveBeenCalled();
          expect(mockGetUserRole).toHaveBeenCalledWith(mockUser.id);
          expect(mockCreateUserProfile).toHaveBeenCalledWith(mockUser.id, mockUser.email, 'Coach');
          expect(mockNavigateFn).toHaveBeenCalledWith('/team-setup');
        });
      });

      it('should handle complete existing user login flow', async () => {
        const mockUser = {
          id: 'existing-user-123',
          email: 'existing@example.com',
        };

        // Step 1: Session exists
        mockSupabase.auth.getSession.mockResolvedValue({
          data: { session: { user: mockUser } },
          error: null,
        });

        // Step 2: User exists as coach
        mockGetUserRole.mockResolvedValue({
          id: mockUser.id,
          email: mockUser.email,
          role: 'Coach',
        });

        render(
          <TestWrapper>
            <AuthCallback />
          </TestWrapper>
        );

        // Should show loading initially
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        // Should navigate directly to coach dashboard
        await waitFor(() => {
          expect(mockSupabase.auth.getSession).toHaveBeenCalled();
          expect(mockGetUserRole).toHaveBeenCalledWith(mockUser.id);
          expect(mockNavigateFn).toHaveBeenCalledWith('/coach-dashboard', {
            state: {
              username: mockUser.email,
              userId: mockUser.id,
              isGoogleUser: true,
            },
          });
        });

        // Role selection should never be shown
        expect(screen.queryByTestId('role-selection')).not.toBeInTheDocument();
      });

      it('should handle role-based navigation correctly for different user types', async () => {
        const userTypes = [
          { role: 'Coach', expectedPath: '/coach-dashboard' },
          { role: 'Fan', expectedPath: '/user-dashboard' },
        ];

        for (const userType of userTypes) {
          // Reset mocks for each iteration
          vi.clearAllMocks();
          mockNavigateFn.mockClear();

          const mockUser = {
            id: `${userType.role.toLowerCase()}-user-123`,
            email: `${userType.role.toLowerCase()}@example.com`,
          };

          mockSupabase.auth.getSession.mockResolvedValue({
            data: { session: { user: mockUser } },
            error: null,
          });

          mockGetUserRole.mockResolvedValue({
            id: mockUser.id,
            email: mockUser.email,
            role: userType.role,
          });

          render(
            <TestWrapper>
              <AuthCallback />
            </TestWrapper>
          );

          await waitFor(() => {
            expect(mockNavigateFn).toHaveBeenCalledWith(userType.expectedPath, {
              state: {
                username: mockUser.email,
                userId: mockUser.id,
                isGoogleUser: true,
              },
            });
          });
        }
      });
    });
  });
});