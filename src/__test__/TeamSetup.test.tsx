import { render, screen, fireEvent } from '@testing-library/react';
import TeamSetup from '../pages/TeamSetup';
import { vi } from 'vitest';


vi.mock('../services/teamService', () => ({
  createTeam: vi.fn(),
}));

//Mock react-router-dom fully and override useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { createTeam } from '../services/teamService';

describe('TeamSetup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form elements', () => {
    render(<TeamSetup />);

    expect(screen.getByPlaceholderText(/e.g. kaizer chiefs/i)).toBeInTheDocument();
    expect(screen.getByText(/upload team logo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create team/i })).toBeInTheDocument();
  });

  it('shows error if createTeam returns null', async () => {
    // @ts-ignore
    (createTeam as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    render(<TeamSetup />);

    fireEvent.change(screen.getByPlaceholderText(/e.g. kaizer chiefs/i), {
      target: { value: 'Test Team' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create team/i }));

    const error = await screen.findByText(
      /we could not create your team right now/i
    );
    expect(error).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to coach dashboard if createTeam succeeds', async () => {
    // @ts-ignore
    (createTeam as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1', name: 'Champions' });

    render(<TeamSetup />);

    fireEvent.change(screen.getByPlaceholderText(/e.g. kaizer chiefs/i), {
      target: { value: 'Champions' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create team/i }));

    await screen.findByRole('button', { name: /create team/i });

    expect(mockNavigate).toHaveBeenCalledWith('/coach-dashboard');
  });
});
