import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ProtectedRoute from '../components/ProtectedRoute';
import supabase from '../../supabaseClient';
import * as roleService from '../services/roleService';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../supabaseClient', () => ({
  default: {
    auth: { getSession: vi.fn() },
  },
}));

vi.mock('../services/roleService', () => ({
  isCoach: vi.fn(),
  isFan: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('ProtectedRoute UI Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the loading screen initially', () => {
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null } });

    render(
      <MemoryRouter>
        <ProtectedRoute>Child</ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/Checking access/i)).toBeInTheDocument();
  });

  it('renders child content when access granted (no requiredRole)', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { id: 'u1' } } },
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>Child Content Visible</ProtectedRoute>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Child Content Visible')).toBeInTheDocument();
    });
  });

  it('renders child content when requiredRole matches', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { id: 'u1' } } },
    });
    (roleService.isCoach as any).mockResolvedValue(true);

    render(
      <MemoryRouter>
        <ProtectedRoute requiredRole="Coach">Coach Content</ProtectedRoute>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Coach Content')).toBeInTheDocument();
    });
  });

  it('does not render child content when role mismatch', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { id: 'u1' } } },
    });
    (roleService.isCoach as any).mockResolvedValue(false);

    render(
      <MemoryRouter>
        <ProtectedRoute requiredRole="Coach">Hidden Content</ProtectedRoute>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Child content should not be in the document
      expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
    });
  });

  it('renders loading screen during async role check', async () => {
    const promise = new Promise((resolve) => setTimeout(() => resolve({ data: { session: { user: { id: 'u1' } } } }), 50));
    (supabase.auth.getSession as any).mockReturnValue(promise);

    render(
      <MemoryRouter>
        <ProtectedRoute requiredRole="Fan">Fan Content</ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/Checking access/i)).toBeInTheDocument();
  });

  it('redirects when user not logged in and does not render children', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null } });

    render(
      <MemoryRouter>
        <ProtectedRoute>Should not render</ProtectedRoute>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(screen.queryByText('Should not render')).not.toBeInTheDocument();
    });
  });
});
