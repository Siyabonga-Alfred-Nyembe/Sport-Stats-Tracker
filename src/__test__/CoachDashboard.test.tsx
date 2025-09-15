// src/__tests__/CoachDashboard.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import CoachDashboard from "../pages/coachDashboard/CoachDashboard";

// --- Mock services ---
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../supabaseClient", () => ({
  default: {
    auth: {
      getSession: vi.fn(() =>
        Promise.resolve({
          data: { session: { user: { email: "coach@test.com" } } },
        })
      ),
    },
  },
}));

vi.mock("../services/teamService", () => ({
  getCurrentTeamId: vi.fn(() => "team-123"),
}));

// --- Mock child components for UNIT tests ---
vi.mock("../pages/coachDashboard/DashboardHeader", () => ({
  default: ({ setActiveTab, username, onProfileClick, onReportIssue }: any) => (
    <div>
      <p data-testid="username">{username}</p>
      <button onClick={() => setActiveTab("myTeam")}>Go My Team</button>
      <button onClick={() => setActiveTab("matches")}>Go Matches</button>
      <button onClick={() => setActiveTab("players")}>Go Players</button>
      <button onClick={onProfileClick}>Profile</button>
      <button onClick={onReportIssue}>Report Issue</button>
    </div>
  ),
}));

vi.mock("../pages/coachDashboard/DashboardSidebar", () => ({
  default: ({ onNavigate }: any) => (
    <div data-testid="sidebar">
      <button onClick={() => onNavigate("myTeam")}>Teams</button>
      <button onClick={() => onNavigate("matches")}>Matches</button>
      <button onClick={() => onNavigate("players")}>Players</button>
    </div>
  ),
}));

vi.mock("../pages/coachDashboard/coachStatsPage/MyTeamTab", () => ({
  default: () => <div data-testid="my-team-tab">MyTeamTab Component</div>,
}));

vi.mock("../pages/coachDashboard/matchManaging/MatchesPage", () => ({
  default: () => <div data-testid="matches-page">MatchesPage Component</div>,
}));

vi.mock("../pages/coachDashboard/playerManagement/PlayerManagementPage", () => ({
  default: () => <div data-testid="player-management-page">PlayerManagementPage Component</div>,
}));

// -------------------- UNIT TESTS --------------------
describe("CoachDashboard - Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders default Matches tab", () => {
    render(<CoachDashboard />, { wrapper: MemoryRouter });
    expect(screen.getByTestId("matches-page")).toBeInTheDocument();
  });

  it("displays username from session", async () => {
    render(<CoachDashboard />, { wrapper: MemoryRouter });
    await waitFor(() => {
      expect(screen.getByTestId("username")).toHaveTextContent("coach@test.com");
    });
  });

  it("switches to MyTeam tab via header", () => {
    render(<CoachDashboard />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText("Go My Team"));
    expect(screen.getByTestId("my-team-tab")).toBeInTheDocument();
    expect(screen.queryByTestId("matches-page")).not.toBeInTheDocument();
  });

  it("switches to Players tab via header", () => {
    render(<CoachDashboard />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText("Go Players"));
    expect(screen.getByTestId("player-management-page")).toBeInTheDocument();
    expect(screen.queryByTestId("matches-page")).not.toBeInTheDocument();
  });

  it("switches tabs via sidebar", () => {
    render(<CoachDashboard />, { wrapper: MemoryRouter });
    
    // Test sidebar navigation
    fireEvent.click(screen.getByText("Teams"));
    expect(screen.getByTestId("my-team-tab")).toBeInTheDocument();
    
    fireEvent.click(screen.getByText("Players"));
    expect(screen.getByTestId("player-management-page")).toBeInTheDocument();
    
    fireEvent.click(screen.getByText("Matches"));
    expect(screen.getByTestId("matches-page")).toBeInTheDocument();
  });

  it("navigates to profile settings when profile button is clicked", () => {
    render(<CoachDashboard />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText("Profile"));
    expect(mockNavigate).toHaveBeenCalledWith('/profile-settings');
  });

  it("handles report issue click", () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      render(<CoachDashboard />, { wrapper: MemoryRouter });
      fireEvent.click(screen.getByText("Report Issue"));
      expect(consoleSpy).toHaveBeenCalledWith('Report issue clicked');
      consoleSpy.mockRestore();
  });

  it("renders sidebar component", () => {
    render(<CoachDashboard />, { wrapper: MemoryRouter });
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });
});

// -------------------- EDGE CASES --------------------
describe("CoachDashboard - Edge Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to team setup when no team ID exists", async () => {
    const { getCurrentTeamId } = await import("../services/teamService");
    vi.mocked(getCurrentTeamId).mockReturnValue(null);

    render(<CoachDashboard />, { wrapper: MemoryRouter });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/team-setup');
    });
  });

  it("handles no session", async () => {
    // Re-mock supabase for this specific test
    vi.doMock("../../supabaseClient", () => ({
      default: {
        auth: {
          getSession: vi.fn(() =>
            Promise.resolve({
              data: { session: null },
            })
          ),
        },
      },
    }));

    // Re-import the component to get the updated mock
    const { default: CoachDashboardTest } = await import("../pages/coachDashboard/CoachDashboard");
    
    render(<CoachDashboardTest />, { wrapper: MemoryRouter });
    
    // Should still render without crashing
    expect(screen.getByTestId("matches-page")).toBeInTheDocument();
  });
});

// -------------------- INTEGRATION TESTS --------------------
describe("CoachDashboard - Integration Tests", () => {
  let CoachDashboardReal: any;

  beforeAll(async () => {
    // Unmock components for integration tests
    vi.doUnmock("../pages/coachDashboard/DashboardHeader");
    vi.doUnmock("../pages/coachDashboard/DashboardSidebar");
    vi.doUnmock("../pages/coachDashboard/coachStatsPage/MyTeamTab");
    vi.doUnmock("../pages/coachDashboard/matchManaging/MatchesPage");
    vi.doUnmock("../pages/coachDashboard/playerManagement/PlayerManagementPage");
  });

  beforeEach(async () => {
    vi.resetModules();
    CoachDashboardReal = (await import("../pages/coachDashboard/CoachDashboard")).default;
  });


  it("navigates to Teams (MyTeam) via sidebar with real components", async () => {
    render(
      <MemoryRouter>
        <CoachDashboardReal />
      </MemoryRouter>
    );

    // Open sidebar (assumes there's a toggle button)
    const toggleButton = await screen.findByRole("button", { name: /toggle navigation menu/i });
    fireEvent.click(toggleButton);

    // Click Teams in sidebar
    const teamsButton = await screen.findByRole("button", { name: /Teams/i });
    fireEvent.click(teamsButton);

    // Verify MyTeam tab is displayed
    expect(await screen.findByText(/My Team/i)).toBeInTheDocument();
  });

it("navigates to Teams (MyTeam) via sidebar with real components", async () => {
    render(
      <MemoryRouter>
        <CoachDashboardReal />
      </MemoryRouter>
    );

    // Open sidebar (assumes there's a toggle button)
    const toggleButton = await screen.findByRole("button", { name: /toggle navigation menu/i });
    fireEvent.click(toggleButton);

    // Click Teams in sidebar
    const teamsButton = await screen.findByRole("button", { name: /Teams/i });
    fireEvent.click(teamsButton);

    // Verify MyTeam tab is displayed
    expect(await screen.findByText(/My Team/i)).toBeInTheDocument();
  });
});
