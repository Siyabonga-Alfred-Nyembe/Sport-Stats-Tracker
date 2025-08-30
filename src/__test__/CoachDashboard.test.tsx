import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CoachDashboard from "../pages/coachDashboard/CoachDashboard";
import { getCurrentTeamId } from "../services/teamService";

// --- Mock subcomponents for simpler UI tests ---
vi.mock("../pages/DashboardHeader", () => ({
  default: ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => (
    <div>
      <button onClick={() => setActiveTab("matches")}>Matches Tab</button>
      <button onClick={() => setActiveTab("myTeam")}>My Team Tab</button>
      <button onClick={() => setActiveTab("players")}>Players Tab</button>
      <button>Profile</button>
    </div>
  ),
}));

vi.mock("../pages/MyTeamTab", () => ({
  default: () => <div>MyTeamTab Content</div>,
}));

vi.mock("../pages/matchManaging/MatchesPage", () => ({
  default: () => <div>MatchesPage Content</div>,
}));

vi.mock("../pages/playerManagement/PlayerManagementPage", () => ({
  default: () => <div>PlayerManagementPage Content</div>,
}));

// --- Mock teamService ---
vi.mock("../../services/teamService", () => ({
  getCurrentTeamId: vi.fn(),
}));

// --- Mock useNavigate ---
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CoachDashboard UI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders MatchesPage by default", () => {
    (getCurrentTeamId as vi.Mock).mockReturnValue("team123");

    render(
      <MemoryRouter>
        <CoachDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText("MatchesPage Content")).toBeInTheDocument();
  });

  it("switches to MyTeamTab when clicking the tab", () => {
    (getCurrentTeamId as vi.Mock).mockReturnValue("team123");

    render(
      <MemoryRouter>
        <CoachDashboard />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("My Team Tab"));
    expect(screen.getByText("MyTeamTab Content")).toBeInTheDocument();
  });

  it("switches to PlayerManagementPage when clicking the tab", () => {
    (getCurrentTeamId as vi.Mock).mockReturnValue("team123");

    render(
      <MemoryRouter>
        <CoachDashboard />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Players Tab"));
    expect(screen.getByText("PlayerManagementPage Content")).toBeInTheDocument();
  });

  it("navigates to /team-setup if no teamId is found", async () => {
    (getCurrentTeamId as vi.Mock).mockReturnValue(null);

    render(
      <MemoryRouter>
        <CoachDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/team-setup");
    });
  });
});
