import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "../pages/userDashboard/Sidebar";
import { describe, it, expect, vi } from "vitest";
import React from "react";

describe("Sidebar Component", () => {
  const mockGoToTab = vi.fn();

  const tabs = ["overview", "teams", "players", "matches", "favorites"] as const;

  beforeEach(() => {
    mockGoToTab.mockClear();
  });

  // --- UNIT TESTS ---
  it("renders without crashing", () => {
    render(<Sidebar activeTab="overview" goToTab={mockGoToTab} />);
  });

  it("renders the brand and menu image", () => {
    render(<Sidebar activeTab="overview" goToTab={mockGoToTab} />);
    expect(screen.getByText("R&S Sports")).toBeInTheDocument();
    expect(screen.getByAltText("Menu")).toBeInTheDocument();
  });

  it("renders all tabs as buttons", () => {
    render(<Sidebar activeTab="overview" goToTab={mockGoToTab} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(tabs.length);
    tabs.forEach(tab => {
      expect(screen.getByText(tab[0].toUpperCase() + tab.slice(1))).toBeInTheDocument();
    });
  });

  it("applies the 'active' class to the activeTab", () => {
    render(<Sidebar activeTab="players" goToTab={mockGoToTab} />);
    expect(screen.getByText("Players")).toHaveClass("active");
    // Other tabs should not have active
    expect(screen.getByText("Teams")).not.toHaveClass("active");
  });

  //UI TESTS
  it("calls goToTab with correct tab when a button is clicked", () => {
    render(<Sidebar activeTab="overview" goToTab={mockGoToTab} />);
    fireEvent.click(screen.getByText("Matches"));
    expect(mockGoToTab).toHaveBeenCalledTimes(1);
    expect(mockGoToTab).toHaveBeenCalledWith("matches");
  });


  //INTEGRATION TEST
  it("integration: switching tabs updates active tab visually", () => {
    const Wrapper = () => {
      const [active, setActive] = React.useState<"overview" | "teams" | "players" | "matches" | "favorites">("overview");
      return <Sidebar activeTab={active} goToTab={setActive} />;
    };

    render(<Wrapper />);
    
    const matchesBtn = screen.getByText("Matches");
    fireEvent.click(matchesBtn);

    expect(screen.getByText("Matches")).toHaveClass("active");
    expect(screen.getByText("Overview")).not.toHaveClass("active");
  });
});
