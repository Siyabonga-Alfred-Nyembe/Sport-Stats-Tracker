import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import RoleSelection from '../components/RoleSelection';
import { MemoryRouter } from 'react-router-dom';

describe('RoleSelection Component', () => {
  const userEmail = 'test@example.com';
  const onRoleSelected = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders component with both roles', () => {
    render(
      <MemoryRouter>
        <RoleSelection userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome to Sport Stats Tracker/i)).toBeInTheDocument();
    expect(screen.getByText(/Fan/i)).toBeInTheDocument();
    expect(screen.getByText(/Coach/i)).toBeInTheDocument();
  });

  it('selects Fan role when clicked', () => {
    render(
      <MemoryRouter>
        <RoleSelection userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Fan'));
    const continueBtn = screen.getByRole('button', { name: /Continue as Fan/i });
    expect(continueBtn).toBeInTheDocument();
  });

  it('selects Coach role when clicked', () => {
    render(
      <MemoryRouter>
        <RoleSelection userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Coach'));
    const continueBtn = screen.getByRole('button', { name: /Continue as Coach/i });
    expect(continueBtn).toBeInTheDocument();
  });

  it('calls onRoleSelected for Fan', async () => {
    render(
      <MemoryRouter>
        <RoleSelection userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Fan'));
    fireEvent.click(screen.getByRole('button', { name: /Continue as Fan/i }));

    await waitFor(() => {
      expect(onRoleSelected).toHaveBeenCalledWith('Fan');
    });
  });

  it('calls onRoleSelected for Coach', async () => {
    render(
      <MemoryRouter>
        <RoleSelection userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Coach'));
    fireEvent.click(screen.getByRole('button', { name: /Continue as Coach/i }));

    await waitFor(() => {
      expect(onRoleSelected).toHaveBeenCalledWith('Coach');
    });
  });

  it('displays loading state while processing', async () => {
    render(
      <MemoryRouter>
        <RoleSelection userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Fan'));
    fireEvent.click(screen.getByRole('button', { name: /Continue as Fan/i }));

    expect(screen.getByRole('button', { name: /Setting up.../i })).toBeDisabled();

    await waitFor(() => {
      expect(onRoleSelected).toHaveBeenCalled();
    });
  });

  it('handles role selection without errors', async () => {
    render(
      <MemoryRouter>
        <RoleSelection userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Fan'));
    fireEvent.click(screen.getByRole('button', { name: /Continue as Fan/i }));

    await waitFor(() => {
      expect(onRoleSelected).toHaveBeenCalledWith('Fan');
    });
  });

  it('handles role selection successfully', async () => {
    render(
      <MemoryRouter>
        <RoleSelection userEmail={userEmail} onRoleSelected={onRoleSelected} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Fan'));
    fireEvent.click(screen.getByRole('button', { name: /Continue as Fan/i }));

    await waitFor(() => {
      expect(onRoleSelected).toHaveBeenCalledWith('Fan');
    });
  });
});
