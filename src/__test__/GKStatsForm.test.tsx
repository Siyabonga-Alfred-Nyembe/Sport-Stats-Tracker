import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GKStatsForm from "../pages/coachDashboard/matchManaging/PlayerStatsForm/GKStatsForm";

describe("GKStatsForm Component", () => {
  const mockSave = vi.fn();

  beforeEach(() => {
    mockSave.mockClear();
  });

  // it("renders all input fields with initial values", () => {
  //   render(<GKStatsForm onSave={mockSave} />);

  //   expect(screen.getByLabelText("Saves")).toHaveValue(0);
  //   expect(screen.getByLabelText("Clearances")).toHaveValue(0);
  //   expect(screen.getByLabelText("Shots Against")).toHaveValue(0);
  //   expect(screen.getByLabelText("Goals Conceded")).toHaveValue(0);
  // });

  // it("updates input values when changed", () => {
  //   render(<GKStatsForm onSave={mockSave} />);

  //   const savesInput = screen.getByLabelText("Saves") as HTMLInputElement;
  //   fireEvent.change(savesInput, { target: { value: "5" } });
  //   expect(savesInput.value).toBe("5");

  //   const goalsConcededInput = screen.getByLabelText("Goals Conceded") as HTMLInputElement;
  //   fireEvent.change(goalsConcededInput, { target: { value: "2" } });
  //   expect(goalsConcededInput.value).toBe("2");
  // });

  // it("calls onSave with current stats on submit", () => {
  //   render(<GKStatsForm onSave={mockSave} />);

  //   fireEvent.change(screen.getByLabelText("Saves"), { target: { value: "3" } });
  //   fireEvent.change(screen.getByLabelText("Clearances"), { target: { value: "1" } });

  //   fireEvent.click(screen.getByText("Save"));
  //   expect(mockSave).toHaveBeenCalledWith({
  //     saves: 3,
  //     clearances: 1,
  //     shotsAgainst: 0,
  //     goalsConceded: 0,
  //   });
  // });

  // it("accepts negative numbers", () => {
  //   render(<GKStatsForm onSave={mockSave} />);

  //   fireEvent.change(screen.getByLabelText("Clearances"), { target: { value: "-3" } });
  //   fireEvent.change(screen.getByLabelText("Goals Conceded"), { target: { value: "-1" } });

  //   fireEvent.click(screen.getByText("Save"));
  //   expect(mockSave).toHaveBeenCalledWith({
  //     saves: 0,
  //     clearances: -3,
  //     shotsAgainst: 0,
  //     goalsConceded: -1,
  //   });
  // });

  it("submits default values if inputs are not modified", () => {
    render(<GKStatsForm onSave={mockSave} />);
    fireEvent.click(screen.getByText("Save"));
    expect(mockSave).toHaveBeenCalledWith({
      saves: 0,
      clearances: 0,
      shotsAgainst: 0,
      goalsConceded: 0,
    });
  });
});

