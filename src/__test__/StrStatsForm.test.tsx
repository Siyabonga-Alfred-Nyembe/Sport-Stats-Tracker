import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StrStatsForm from '../pages/coachDashboard/matchManaging/PlayerStatsForm/StrStatsForm';

describe('StrStatsForm Component', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Unit Tests', () => {
    it('should render all form fields with correct labels and initial values', () => {
      render(<StrStatsForm onSave={mockOnSave} />);

      expect(screen.getByText('Shots')).toBeInTheDocument();
      expect(screen.getByText('ShotsOnTarget')).toBeInTheDocument();
      expect(screen.getByText('dribblesAttempted')).toBeInTheDocument();
      expect(screen.getByText('dribblesSuccessful')).toBeInTheDocument();
      expect(screen.getByText('offsides')).toBeInTheDocument();

      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveValue(0);
      });
    });

    it('should render save button with correct type', () => {
      render(<StrStatsForm onSave={mockOnSave} />);
      
      const saveButton = screen.getByText('Save');
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toHaveAttribute('type', 'submit');
    });

    it('should update individual field values correctly', () => {
      render(<StrStatsForm onSave={mockOnSave} />);

      const inputs = screen.getAllByRole('spinbutton');
      fireEvent.change(inputs[0], { target: { value: '5' } }); // Shots
      
      expect(inputs[0]).toHaveValue(5);
    });

    it('should call onSave with correct default values on submit', () => {
      render(<StrStatsForm onSave={mockOnSave} />);

      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith({
        Shots: 0,
        ShotsOnTarget: 0,
        dribblesAttempted: 0,
        dribblesSuccessful: 0,
        offsides: 0,
      });
    });

  });

  describe('Integration Tests', () => {
    it('should handle complete form workflow with all field updates', () => {
      render(<StrStatsForm onSave={mockOnSave} />);

      const inputs = screen.getAllByRole('spinbutton');
      
      // Update all fields (Shots, ShotsOnTarget, dribblesAttempted, dribblesSuccessful, offsides)
      fireEvent.change(inputs[0], { target: { value: '8' } });
      fireEvent.change(inputs[1], { target: { value: '5' } });
      fireEvent.change(inputs[2], { target: { value: '6' } });
      fireEvent.change(inputs[3], { target: { value: '4' } });
      fireEvent.change(inputs[4], { target: { value: '2' } });

      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith({
        Shots: 8,
        ShotsOnTarget: 5,
        dribblesAttempted: 6,
        dribblesSuccessful: 4,
        offsides: 2,
      });
    });

    it('should maintain state across multiple interactions', () => {
      render(<StrStatsForm onSave={mockOnSave} />);

      const inputs = screen.getAllByRole('spinbutton');
      
      // First interaction with shots
      fireEvent.change(inputs[0], { target: { value: '3' } });
      expect(inputs[0]).toHaveValue(3);

      // Update shots again
      fireEvent.change(inputs[0], { target: { value: '7' } });
      expect(inputs[0]).toHaveValue(7);

      // Update different field
      fireEvent.change(inputs[2], { target: { value: '4' } }); // dribblesAttempted
      expect(inputs[2]).toHaveValue(4);

      // Original shots field should maintain value
      expect(inputs[0]).toHaveValue(7);

      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith({
        Shots: 7,
        ShotsOnTarget: 0,
        dribblesAttempted: 4,
        dribblesSuccessful: 0,
        offsides: 0,
      });
    });

    it('should handle partial form updates correctly', () => {
      render(<StrStatsForm onSave={mockOnSave} />);

      const inputs = screen.getAllByRole('spinbutton');
      
      // Update only some fields
      fireEvent.change(inputs[0], { target: { value: '10' } }); // Shots
      fireEvent.change(inputs[4], { target: { value: '1' } });  // offsides

      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith({
        Shots: 10,
        ShotsOnTarget: 0,
        dribblesAttempted: 0,
        dribblesSuccessful: 0,
        offsides: 1,
      });
    });
  });

  describe('Edge Tests', () => {
    it('should handle negative numbers correctly', () => {
      render(<StrStatsForm onSave={mockOnSave} />);

      const inputs = screen.getAllByRole('spinbutton');
      fireEvent.change(inputs[4], { target: { value: '-1' } }); // offsides
      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ offsides: -1 })
      );
    });

    it('should handle decimal numbers', () => {
      render(<StrStatsForm onSave={mockOnSave} />);

      const inputs = screen.getAllByRole('spinbutton');
      fireEvent.change(inputs[0], { target: { value: '5.5' } }); // Shots
      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ Shots: 5.5 })
      );
    });

    it('should handle empty string input by converting to 0', () => {
      render(<StrStatsForm onSave={mockOnSave} />);

      const inputs = screen.getAllByRole('spinbutton');
      
      // Set a value first
      fireEvent.change(inputs[1], { target: { value: '5' } });
      expect(inputs[1]).toHaveValue(5);

      // Clear the value
      fireEvent.change(inputs[1], { target: { value: '' } });
      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ ShotsOnTarget: 0 })
      );
    });

    it('should handle very large numbers', () => {
      render(<StrStatsForm onSave={mockOnSave} />);

      const inputs = screen.getAllByRole('spinbutton');
      fireEvent.change(inputs[0], { target: { value: '999999' } }); // Shots
      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ Shots: 999999 })
      );
    });

    it('should handle zero values correctly', () => {
      render(<StrStatsForm onSave={mockOnSave} />);

      const inputs = screen.getAllByRole('spinbutton');
      
      // Set value then reset to 0
      fireEvent.change(inputs[3], { target: { value: '8' } }); // dribblesSuccessful
      fireEvent.change(inputs[3], { target: { value: '0' } });

      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ dribblesSuccessful: 0 })
      );
    });

    it('should handle rapid consecutive changes to same field', () => {
      render(<StrStatsForm onSave={mockOnSave} />);

      const inputs = screen.getAllByRole('spinbutton');
      
      // Rapid changes to Shots
      fireEvent.change(inputs[0], { target: { value: '1' } });
      fireEvent.change(inputs[0], { target: { value: '3' } });
      fireEvent.change(inputs[0], { target: { value: '6' } });
      fireEvent.change(inputs[0], { target: { value: '12' } });

      expect(inputs[0]).toHaveValue(12);

      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ Shots: 12 })
      );
    });

    it('should handle form submission without any user input', () => {
      render(<StrStatsForm onSave={mockOnSave} />);

      // Submit immediately without changes
      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith({
        Shots: 0,
        ShotsOnTarget: 0,
        dribblesAttempted: 0,
        dribblesSuccessful: 0,
        offsides: 0,
      });
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it('should handle mixed positive and negative values', () => {
      render(<StrStatsForm onSave={mockOnSave} />);

      const inputs = screen.getAllByRole('spinbutton');
      
      fireEvent.change(inputs[0], { target: { value: '15' } }); // Shots
      fireEvent.change(inputs[1], { target: { value: '8' } });  // ShotsOnTarget
      fireEvent.change(inputs[4], { target: { value: '-2' } }); // offsides

      fireEvent.click(screen.getByText('Save'));

      expect(mockOnSave).toHaveBeenCalledWith({
        Shots: 15,
        ShotsOnTarget: 8,
        dribblesAttempted: 0,
        dribblesSuccessful: 0,
        offsides: -2,
      });
    });
  });
});