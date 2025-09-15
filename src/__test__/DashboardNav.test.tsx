// src/components/__tests__/DashboardNav.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DashboardNav from "../pages/coachDashboard/DashboardNav";

describe("DashboardNav", () => {
  it("renders all navigation buttons", () => {
    const mockSetActiveTab = vi.fn();
    const mockReportIssue = vi.fn();

    render(
      <DashboardNav
        setActiveTab={mockSetActiveTab}
        onReportIssue={mockReportIssue}
      />
    );

    expect(screen.getByText("My Team")).toBeInTheDocument();
    expect(screen.getByText("Matches")).toBeInTheDocument();
    expect(screen.getByText("Players")).toBeInTheDocument();
    expect(screen.getByText("Report Issue")).toBeInTheDocument();
  });

  it("calls setActiveTab with correct values when navigation buttons are clicked", () => {
    const mockSetActiveTab = vi.fn();
    const mockReportIssue = vi.fn();

    render(
      <DashboardNav
        setActiveTab={mockSetActiveTab}
        onReportIssue={mockReportIssue}
      />
    );

    fireEvent.click(screen.getByText("My Team"));
    expect(mockSetActiveTab).toHaveBeenCalledWith("myTeam");

    fireEvent.click(screen.getByText("Matches"));
    expect(mockSetActiveTab).toHaveBeenCalledWith("matches");

    fireEvent.click(screen.getByText("Players"));
    expect(mockSetActiveTab).toHaveBeenCalledWith("players");
  });

  it("calls onReportIssue when Report Issue button is clicked", () => {
    const mockSetActiveTab = vi.fn();
    const mockReportIssue = vi.fn();

    render(
      <DashboardNav
        setActiveTab={mockSetActiveTab}
        onReportIssue={mockReportIssue}
      />
    );

    fireEvent.click(screen.getByText("Report Issue"));
    expect(mockReportIssue).toHaveBeenCalled();
  });
});
