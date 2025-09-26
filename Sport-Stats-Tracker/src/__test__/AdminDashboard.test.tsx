import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AdminDashboard from '../pages/AdminDashboard';
import supabase from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  default: {
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
        order: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(),
      })),
    })),
  },
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: vi.fn(),
});

// Test data
const mockCoaches = [
  {
    id: '1',
    email: 'coach1@test.com',
    name: 'John Coach',
    status: 'pending' as const,
    created_at: '2023-01-01T00:00:00Z',
    team_name: 'Team A',
    experience: '5 years',
  },
  {
    id: '2',
    email: 'coach2@test.com',
    name: 'Jane Coach',
    status: 'approved' as const,
    created_at: '2023-01-02T00:00:00Z',
    team_name: 'Team B',
    experience: '3 years',
  },
  {
    id: '3',
    email: 'coach3@test.com',
    name: 'Bob Coach',
    status: 'rejected' as const,
    created_at: '2023-01-03T00:00:00Z',
  },
];

const mockUsers = [
  {
    id: 'user1',
    email: 'user1@test.com',
    role: 'fan' as const,
    created_at: '2023-01-01T00:00:00Z',
    last_sign_in: new Date().toISOString(),
  },
  {
    id: 'user2',
    email: 'admin@test.com',
    role: 'admin' as const,
    created_at: '2023-01-02T00:00:00Z',
    last_sign_in: '2023-01-01T00:00:00Z',
  },
  {
    id: 'user3',
    email: 'coach@test.com',
    role: 'coach' as const,
    created_at: '2023-01-03T00:00:00Z',
  },
];

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <AdminDashboard />
    </BrowserRouter>
  );
};

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default successful auth mock
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { id: 'admin-id' } } }
    });

    // Default admin profile mock
    const mockSelect = vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({
          data: { role: 'admin' }
        })
      }))
    }));

    const mockFrom = vi.fn((table: string) => {
      if (table === 'profiles') {
        return {
          select: mockSelect,
          delete: vi.fn(() => ({
            eq: vi.fn().mockResolvedValue({ error: null })
          })),
          update: vi.fn(() => ({
            eq: vi.fn().mockResolvedValue({ error: null })
          }))
        };
      }
      if (table === 'coaches') {
        return {
          select: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: mockCoaches })
          })),
          update: vi.fn(() => ({
            eq: vi.fn().mockResolvedValue({ error: null })
          }))
        };
      }
    });

    (supabase.from as any).mockImplementation(mockFrom);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // UNIT TESTS
  describe('Unit Tests', () => {
    it('should render loading state initially', () => {
      renderComponent();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render dashboard header with correct title', async () => {
      // Mock successful data fetch
      const mockFrom = vi.fn((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { role: 'admin' } })
              })),
              order: vi.fn().mockResolvedValue({ data: mockUsers })
            }))
          };
        }
        return {
          select: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: mockCoaches })
          }))
        };
      });
      (supabase.from as any).mockImplementation(mockFrom);

      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      });
    });
  });

  // INTEGRATION TESTS
  describe('Integration Tests', () => {

    it('should approve a coach successfully', async () => {
      const mockUpdate = vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null })
      }));
      
      const mockFrom = vi.fn((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { role: 'admin' } })
              })),
              order: vi.fn().mockResolvedValue({ data: mockUsers })
            })),
            update: mockUpdate
          };
        }
        return {
          select: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: mockCoaches })
          })),
          update: mockUpdate
        };
      });
      (supabase.from as any).mockImplementation(mockFrom);

      renderComponent();
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByText('John Coach')).toBeInTheDocument();
      });

      const approveButton = screen.getByRole('button', { name: 'Approve' });
      await user.click(approveButton);

      expect(mockUpdate).toHaveBeenCalledWith({ status: 'approved' });
    });

    it('should reject a coach successfully', async () => {
      const mockUpdate = vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null })
      }));
      
      const mockFrom = vi.fn((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { role: 'admin' } })
              })),
              order: vi.fn().mockResolvedValue({ data: mockUsers })
            }))
          };
        }
        return {
          select: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: mockCoaches })
          })),
          update: mockUpdate
        };
      });
      (supabase.from as any).mockImplementation(mockFrom);

      renderComponent();
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByText('John Coach')).toBeInTheDocument();
      });

      const rejectButton = screen.getByRole('button', { name: 'Reject' });
      await user.click(rejectButton);

      expect(mockUpdate).toHaveBeenCalledWith({ status: 'rejected' });
    });
  });

  // EDGE CASES
  describe('Edge Cases', () => {
    it('should redirect to login if no session', async () => {
      (supabase.auth.getSession as any).mockResolvedValue({
        data: { session: null }
      });

      renderComponent();
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('should redirect to home if user is not admin', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: { role: 'fan' }
            })
          }))
        }))
      }));
      (supabase.from as any).mockImplementation(mockFrom);

      renderComponent();
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('should handle empty coaches list', async () => {
      const mockFrom = vi.fn((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { role: 'admin' } })
              })),
              order: vi.fn().mockResolvedValue({ data: [] })
            }))
          };
        }
        return {
          select: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: [] })
          }))
        };
      });
      (supabase.from as any).mockImplementation(mockFrom);

      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('No coach applications found.')).toBeInTheDocument();
      });
    });

    it('should handle API errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const mockFrom = vi.fn((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { role: 'admin' } })
              })),
              order: vi.fn().mockRejectedValue(new Error('API Error'))
            }))
          };
        }
        return {
          select: vi.fn(() => ({
            order: vi.fn().mockRejectedValue(new Error('API Error'))
          }))
        };
      });
      (supabase.from as any).mockImplementation(mockFrom);

      renderComponent();
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

  });

  // UI INTERACTION TESTS
  describe('UI Interaction Tests', () => {
    it('should highlight active tab correctly', async () => {
      const mockFrom = vi.fn((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { role: 'admin' } })
              })),
              order: vi.fn().mockResolvedValue({ data: [] })
            }))
          };
        }
        return {
          select: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: [] })
          }))
        };
      });
      (supabase.from as any).mockImplementation(mockFrom);

      renderComponent();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const coachesTab = screen.getByRole('button', { name: 'Coach Applications' });
        expect(coachesTab).toHaveClass('active');
      });

      // Click Users tab
      const usersTab = screen.getByRole('button', { name: 'User Management' });
      await user.click(usersTab);
      
      expect(usersTab).toHaveClass('active');
      expect(screen.getByRole('button', { name: 'Coach Applications' })).not.toHaveClass('active');
    });

    it('should navigate back to home when back button is clicked', async () => {
      const mockFrom = vi.fn((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { role: 'admin' } })
              })),
              order: vi.fn().mockResolvedValue({ data: [] })
            }))
          };
        }
        return {
          select: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: [] })
          }))
        };
      });
      (supabase.from as any).mockImplementation(mockFrom);

      renderComponent();
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByText('Back to Home')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Back to Home'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should display correct status badges for coaches', async () => {
      const mockFrom = vi.fn((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { role: 'admin' } })
              })),
              order: vi.fn().mockResolvedValue({ data: [] })
            }))
          };
        }
        return {
          select: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: mockCoaches })
          }))
        };
      });
      (supabase.from as any).mockImplementation(mockFrom);

      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('pending')).toBeInTheDocument();
        expect(screen.getByText('approved')).toBeInTheDocument();
        expect(screen.getByText('rejected')).toBeInTheDocument();
      });

      const pendingBadge = screen.getByText('pending');
      const approvedBadge = screen.getByText('approved');
      const rejectedBadge = screen.getByText('rejected');

      expect(pendingBadge).toHaveClass('status-badge', 'pending');
      expect(approvedBadge).toHaveClass('status-badge', 'approved');
      expect(rejectedBadge).toHaveClass('status-badge', 'rejected');
    });

    it('should show action buttons only for pending coaches', async () => {
      const mockFrom = vi.fn((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { role: 'admin' } })
              })),
              order: vi.fn().mockResolvedValue({ data: [] })
            }))
          };
        }
        return {
          select: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: mockCoaches })
          }))
        };
      });
      (supabase.from as any).mockImplementation(mockFrom);

      renderComponent();
      
      await waitFor(() => {
        // Should have approve/reject buttons for pending coach
        expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reject' })).toBeInTheDocument();
        
        // Should show "Action taken" for non-pending coaches
        expect(screen.getAllByText('Action taken')).toHaveLength(2);
      });
    });

  });
});