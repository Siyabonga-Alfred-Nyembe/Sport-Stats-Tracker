import { render, screen } from "@testing-library/react";
import App from "../App";
import { vi } from "vitest";

// Mock pages
vi.mock("../pages/coachDashboard/CoachDashboard", () => ({
  default: () => <div>Coach Dashboard</div>,
}));

describe("App Component", () => {
  it("renders CoachDashboard at root path", () => {
    render(<App />);
    expect(screen.getByText("Coach Dashboard")).toBeInTheDocument();
  });
});
