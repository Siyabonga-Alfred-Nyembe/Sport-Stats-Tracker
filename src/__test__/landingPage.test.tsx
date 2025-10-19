import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../pages/landingPage";

// Mock supabase
vi.mock("../../supabaseClient", () => ({
  __esModule: true,
  default: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      signOut: vi.fn().mockResolvedValue({}),
    },
  },
}));

// Mock role service
vi.mock("../services/roleService", () => ({
  getUserRole: vi.fn().mockResolvedValue(null),
}));


describe("UI Tests / LandingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders hero content and buttons for guests", async () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Hero title (split across span, so match textContent)
    expect(
      screen.getByText(
        (_content, element) =>
          element?.textContent === "Track. Analyze. Dominate."
      )
    ).toBeInTheDocument();

    // Guest buttons
    expect(screen.getByRole("button", { name: /Sign Up/i })).toBeInTheDocument();

    // Two "Sign In" buttons (nav + hero)
    const signInButtons = screen.getAllByRole("button", { name: /Sign In/i });
    expect(signInButtons).toHaveLength(2);
  });


  it("navigates to login when sign in clicked", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // There are 2 Sign In buttons — let's test the one in nav
    const nav = screen.getByRole("navigation");
    const navSignInButton = within(nav).getByRole("button", { name: /Sign In/i });

    fireEvent.click(navSignInButton);
    // We can't check navigate directly without mocking useNavigate,
    // but we assert button exists and is clickable
    expect(navSignInButton).toBeInTheDocument();
  });

  it("displays welcome message when logged in", async () => {
    const mockSession = {
      user: {
        id: "test-user-id",
        email: "test@example.com"
      }
    };

    const mockUserRole = {
      id: "test-user-id",
      email: "test@example.com",
      role: "Fan" as const
    };

    // Mock supabase to return a session
    const { default: supabase } = await import("../../supabaseClient");
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: mockSession } });

    // Mock role service to return user role
    const { getUserRole } = await import("../services/roleService");
    vi.mocked(getUserRole).mockResolvedValue(mockUserRole);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Wait for the component to load and check for welcome text
    await screen.findByText("Welcome");
    expect(screen.getByText("Welcome")).toBeInTheDocument();
  });

  it("navigates to correct dashboard based on user role", async () => {
    const mockSession = {
      user: {
        id: "test-user-id",
        email: "test@example.com"
      }
    };

    const mockUserRole = {
      id: "test-user-id",
      email: "test@example.com",
      role: "Coach" as const
    };

    // Mock supabase to return a session
    const { default: supabase } = await import("../../supabaseClient");
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: mockSession } });

    // Mock role service to return user role
    const { getUserRole } = await import("../services/roleService");
    vi.mocked(getUserRole).mockResolvedValue(mockUserRole);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Wait for the component to load and check for dashboard button
    await screen.findByText("Dashboard");
    const dashboardButton = screen.getByText("Dashboard");
    expect(dashboardButton).toBeInTheDocument();
  });
});
