import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MidStatsForm from '../pages/coachDashboard/matchManaging/PlayerStatsForm/MidStatsForm';

describe('MidStatsForm Component', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Unit Tests', () => {

    it('should render save button with correct type', () => {
      render(<MidStatsForm onSave={mockOnSave} />);
      
      const saveButton = screen.getByText('Save');
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toHaveAttribute('type', 'submit');
    });


    it('should call onSave with correct default values on submit', () => {
      render(<MidStatsForm onSave={mockOnSave} />);

      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith({
        passesSuccessful: 0,
        passesAttempted: 0,
        dribblesAttempted: 0,
        dribblesSuccessful: 0,
        offsides: 0,
        tackles: 0,
      });
    });

  });

  describe('Edge Tests', () => {
    // it('should handle negative numbers correctly', () => {
    //   render(<MidStatsForm onSave={mockOnSave} />);

    //   fireEvent.change(screen.getByLabelText('offsides'), { target: { value: '-2' } });
    //   fireEvent.click(screen.getByText('Save'));

    //   expect(mockOnSave).toHaveBeenCalledWith(
    //     expect.objectContaining({ offsides: -2 })
    //   );
    // });

    // it('should handle decimal numbers', () => {
    //   render(<MidStatsForm onSave={mockOnSave} />);

    //   fireEvent.change(screen.getByLabelText('passesSuccessful'), { target: { value: '7.5' } });
    //   fireEvent.click(screen.getByText('Save'));

    //   expect(mockOnSave).toHaveBeenCalledWith(
    //     expect.objectContaining({ passesSuccessful: 7.5 })
    //   );
    // });


    // it('should handle non-numeric string input', () => {
    //   render(<MidStatsForm onSave={mockOnSave} />);

    //   fireEvent.change(screen.getByLabelText('dribblesSuccessful'), { target: { value: 'abc' } });
    //   fireEvent.click(screen.getByText('Save'));

    //   expect(mockOnSave).toHaveBeenCalledWith(
    //     expect.objectContaining({ dribblesSuccessful: NaN })
    //   );
    // });

    // it('should handle zero values correctly', () => {
    //   render(<MidStatsForm onSave={mockOnSave} />);

    //   // Set some values then reset to 0
    //   fireEvent.change(screen.getByLabelText('tackles'), { target: { value: '5' } });
    //   fireEvent.change(screen.getByLabelText('tackles'), { target: { value: '0' } });

    //   fireEvent.click(screen.getByText('Save'));

    //   expect(mockOnSave).toHaveBeenCalledWith(
    //     expect.objectContaining({ tackles: 0 })
    //   );
    // });


    it('should handle form submission without any user input', () => {
      render(<MidStatsForm onSave={mockOnSave} />);

      // Submit immediately without any changes
      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith({
        passesSuccessful: 0,
        passesAttempted: 0,
        dribblesAttempted: 0,
        dribblesSuccessful: 0,
        offsides: 0,
        tackles: 0,
      });
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
  });
});