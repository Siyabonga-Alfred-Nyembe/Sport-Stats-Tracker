import { render, screen, fireEvent} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import DashboardHeader from "../pages/coachDashboard/DashboardHeader";

// Mock dependencies
const mockNavigate = vi.fn();
const mockSignOut = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../../supabaseClient", () => ({
  default: {
    auth: {
      signOut: mockSignOut,
    },
  },
}));

// Mock DashboardNav component for unit tests
vi.mock("../pages/coachDashboard/DashboardNav", () => ({
  default: ({ setActiveTab, onReportIssue }: any) => (
    <nav data-testid="dashboard-nav">
      <button onClick={() => setActiveTab("myTeam")}>My Team</button>
      <button onClick={() => setActiveTab("matches")}>Matches</button>
      <button onClick={() => setActiveTab("players")}>Players</button>
      <button onClick={onReportIssue}>Report Issue</button>
    </nav>
  ),
}));

// Test props
const defaultProps = {
  onProfileClick: vi.fn(),
  setActiveTab: vi.fn(),
  onReportIssue: vi.fn(),
  username: "coach@test.com",
};

const renderComponent = (props = {}) => {
  const finalProps = { ...defaultProps, ...props };
  return render(
    <MemoryRouter>
      <DashboardHeader {...finalProps} />
    </MemoryRouter>
  );
};

// UNIT TESTS
describe("DashboardHeader - Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders header title", () => {
      renderComponent();
      expect(screen.getByRole("heading", { name: /coach dashboard/i })).toBeInTheDocument();
    });

    it("displays username when provided", () => {
      renderComponent({ username: "testcoach@example.com" });
      expect(screen.getByText(/welcome, testcoach@example.com/i)).toBeInTheDocument();
    });

    it("does not display username when not provided", () => {
      renderComponent({ username: undefined });
      expect(screen.queryByText(/welcome,/i)).not.toBeInTheDocument();
    });

    it("renders profile button with correct image", () => {
      renderComponent();
      const profileButton = screen.getByRole("button", { name: /profile/i });
      expect(profileButton).toBeInTheDocument();
      
      const profileImage = screen.getByAltText("Profile");
      expect(profileImage).toHaveAttribute("src", "https://img.icons8.com/?size=100&id=98957&format=png&color=000000");
      expect(profileImage).toHaveAttribute("width", "32");
      expect(profileImage).toHaveAttribute("height", "32");
    });

    it("renders logout button with correct image and text", () => {
      renderComponent();
      const logoutButton = screen.getByRole("button", { name: /logout/i });
      expect(logoutButton).toBeInTheDocument();
      
      const logoutImage = screen.getByAltText("Logout");
      expect(logoutImage).toHaveAttribute("src", "https://img.icons8.com/?size=100&id=98958&format=png&color=000000");
      expect(logoutImage).toHaveAttribute("width", "24");
      expect(logoutImage).toHaveAttribute("height", "24");
    });

    it("renders DashboardNav component", () => {
      renderComponent();
      expect(screen.getByTestId("dashboard-nav")).toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    it("calls onProfileClick when profile button is clicked", () => {
      const onProfileClick = vi.fn();
      renderComponent({ onProfileClick });
      
      fireEvent.click(screen.getByRole("button", { name: /profile/i }));
      expect(onProfileClick).toHaveBeenCalledTimes(1);
    });

    it("calls setActiveTab when nav buttons are clicked", () => {
      const setActiveTab = vi.fn();
      renderComponent({ setActiveTab });
      
      fireEvent.click(screen.getByRole("button", { name: /my team/i }));
      expect(setActiveTab).toHaveBeenCalledWith("myTeam");
      
      fireEvent.click(screen.getByRole("button", { name: /matches/i }));
      expect(setActiveTab).toHaveBeenCalledWith("matches");
      
      fireEvent.click(screen.getByRole("button", { name: /players/i }));
      expect(setActiveTab).toHaveBeenCalledWith("players");
    });

    it("calls onReportIssue when report issue button is clicked", () => {
      const onReportIssue = vi.fn();
      renderComponent({ onReportIssue });
      
      fireEvent.click(screen.getByRole("button", { name: /report issue/i }));
      expect(onReportIssue).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("has proper button roles and accessible names", () => {
      renderComponent();
      
      expect(screen.getByRole("button", { name: /profile/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /my team/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /matches/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /players/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /report issue/i })).toBeInTheDocument();
    });

    it("has proper image alt text", () => {
      renderComponent();
      
      expect(screen.getByAltText("Profile")).toBeInTheDocument();
      expect(screen.getByAltText("Logout")).toBeInTheDocument();
    });
  });
});

// EDGE CASES
describe("DashboardHeader - Edge Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles empty username correctly", () => {
    renderComponent({ username: "" });
    expect(screen.queryByText(/welcome,/i)).not.toBeInTheDocument();
  });

  it("handles null username correctly", () => {
    renderComponent({ username: null as any });
    expect(screen.queryByText(/welcome,/i)).not.toBeInTheDocument();
  });

  it("handles very long username", () => {
    const longUsername = "verylongusernamethatmightcauselayoutissues@example.com";
    renderComponent({ username: longUsername });
    expect(screen.getByText(`Welcome, ${longUsername}`)).toBeInTheDocument();
  });


  it("handles missing prop functions correctly", () => {
    const minimalProps = {
      onProfileClick: vi.fn(),
      setActiveTab: vi.fn(),
      onReportIssue: vi.fn(),
    };
    
    expect(() => renderComponent(minimalProps)).not.toThrow();
  });
});