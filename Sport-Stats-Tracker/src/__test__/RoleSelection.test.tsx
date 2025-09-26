import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import RoleSelection from '../components/RoleSelection';
import * as roleService from '../services/roleService';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../services/roleService', () => ({
  updateUserRole: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('RoleSelection Component', () => {
  const userId = 'u1';
  const userEmail = 'test@example.com';
  const onRoleSelected = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders component with both roles', () => {
    render(
      <MemoryRouter>
        <RoleSelection userId={userId} userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome to Sport Stats Tracker/i)).toBeInTheDocument();
    expect(screen.getByText(/Fan/i)).toBeInTheDocument();
    expect(screen.getByText(/Coach/i)).toBeInTheDocument();
  });

  it('selects Fan role when clicked', () => {
    render(
      <MemoryRouter>
        <RoleSelection userId={userId} userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Fan'));
    const continueBtn = screen.getByRole('button', { name: /Continue as Fan/i });
    expect(continueBtn).toBeInTheDocument();
  });

  it('selects Coach role when clicked', () => {
    render(
      <MemoryRouter>
        <RoleSelection userId={userId} userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Coach'));
    const continueBtn = screen.getByRole('button', { name: /Continue as Coach/i });
    expect(continueBtn).toBeInTheDocument();
  });

  it('calls updateUserRole and navigates for Fan', async () => {
    (roleService.updateUserRole as any).mockResolvedValue(true);

    render(
      <MemoryRouter>
        <RoleSelection userId={userId} userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Fan'));
    fireEvent.click(screen.getByRole('button', { name: /Continue as Fan/i }));

    await waitFor(() => {
      expect(roleService.updateUserRole).toHaveBeenCalledWith(userId, 'Fan');
      expect(onRoleSelected).toHaveBeenCalledWith('Fan');
      expect(mockNavigate).toHaveBeenCalledWith('/user-dashboard');
    });
  });

  it('calls updateUserRole and navigates for Coach', async () => {
    (roleService.updateUserRole as any).mockResolvedValue(true);

    render(
      <MemoryRouter>
        <RoleSelection userId={userId} userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Coach'));
    fireEvent.click(screen.getByRole('button', { name: /Continue as Coach/i }));

    await waitFor(() => {
      expect(roleService.updateUserRole).toHaveBeenCalledWith(userId, 'Coach');
      expect(onRoleSelected).toHaveBeenCalledWith('Coach');
      expect(mockNavigate).toHaveBeenCalledWith('/team-setup');
    });
  });

  it('displays loading state while updating role', async () => {
    let resolvePromise: any;
    const promise = new Promise((resolve) => (resolvePromise = resolve));
    (roleService.updateUserRole as any).mockReturnValue(promise);

    render(
      <MemoryRouter>
        <RoleSelection userId={userId} userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Fan'));
    fireEvent.click(screen.getByRole('button', { name: /Continue as Fan/i }));

    expect(screen.getByRole('button', { name: /Setting up.../i })).toBeDisabled();

    resolvePromise(true);

    await waitFor(() => {
      expect(onRoleSelected).toHaveBeenCalled();
    });
  });

  it('displays error message if updateUserRole fails', async () => {
    (roleService.updateUserRole as any).mockResolvedValue(false);

    render(
      <MemoryRouter>
        <RoleSelection userId={userId} userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Fan'));
    fireEvent.click(screen.getByRole('button', { name: /Continue as Fan/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to update role/i)).toBeInTheDocument();
    });
  });

  it('displays error message on exception', async () => {
    (roleService.updateUserRole as any).mockRejectedValue(new Error('Server error'));

    render(
      <MemoryRouter>
        <RoleSelection userId={userId} userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Fan'));
    fireEvent.click(screen.getByRole('button', { name: /Continue as Fan/i }));

    await waitFor(() => {
      expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
    });
  });
});
