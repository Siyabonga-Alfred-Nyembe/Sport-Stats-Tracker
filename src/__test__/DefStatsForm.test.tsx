import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MidStatsForm from '../pages/coachDashboard/matchManaging/PlayerStatsForm/DefStatsForm';

describe('MidStatsForm Component', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Unit Tests', () => {
    // it('should render all form fields with correct labels', () => {
    //   render(<MidStatsForm onSave={mockOnSave} />);

    //   expect(screen.getByLabelText('passesSuccessful')).toBeInTheDocument();
    //   expect(screen.getByLabelText('passesAttempted')).toBeInTheDocument();
    //   expect(screen.getByLabelText('interceptions')).toBeInTheDocument();
    //   expect(screen.getByLabelText('tackles')).toBeInTheDocument();
    // });

    it('should render save button', () => {
      render(<MidStatsForm onSave={mockOnSave} />);
      
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Save')).toHaveAttribute('type', 'submit');
    });

    it('should initialize all fields with value 0', () => {
      render(<MidStatsForm onSave={mockOnSave} />);

      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveValue(0);
      });
    });

    it('should call onSave with current form data on submit', () => {
      render(<MidStatsForm onSave={mockOnSave} />);

      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith({
        passesSuccessful: 0,
        passesAttempted: 0,
        interceptions: 0,
        tackles: 0,
      });
    });

  });


  describe('Edge Tests', () => {
    // it('should not handle negative numbers', () => {
    //   render(<MidStatsForm onSave={mockOnSave} />);

    //   fireEvent.change(screen.getByLabelText('tackles'), { target: { value: '-5' } });
    //   fireEvent.click(screen.getByText('Save'));

    //   expect(mockOnSave).toHaveBeenCalledWith({
    //     passesSuccessful: 0,
    //     passesAttempted: 0,
    //     interceptions: 0,
    //     tackles: -5,
    //   });
    // });

    // it('should handle non-numeric string input', () => {
    //   render(<MidStatsForm onSave={mockOnSave} />);

    //   fireEvent.change(screen.getByLabelText('tackles'), { target: { value: 'abc' } });
    //   fireEvent.click(screen.getByText('Save'));

    //   expect(mockOnSave).toHaveBeenCalledWith({
    //     passesSuccessful: 0,
    //     passesAttempted: 0,
    //     interceptions: 0,
    //     tackles: NaN,
    //   });
    // });

    it('should handle form submission without any changes', () => {
      render(<MidStatsForm onSave={mockOnSave} />);

      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith({
        passesSuccessful: 0,
        passesAttempted: 0,
        interceptions: 0,
        tackles: 0,
      });
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
  });
});