// src/__tests__/LandingPage.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LandingPage from "../pages/LandingPage";
import { BrowserRouter } from "react-router-dom";
import supabase from "../../supabaseClient";

// Mock react-router useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Supabase auth
vi.mock("../../supabaseClient", () => ({
  auth: {
    getSession: vi.fn(),
  },
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("LandingPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders main sections correctly", async () => {
    // Mock no user logged in
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    renderWithRouter(<LandingPage />);

    // Hero section
    expect(await screen.findByText(/Track. Analyze. Dominate./i)).toBeInTheDocument();

    // CTA buttons
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  it("navigates to signup when 'Sign Up' button is clicked", async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    renderWithRouter(<LandingPage />);

    const signupBtn = await screen.findByText(/Sign Up/i);
    fireEvent.click(signupBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });

  it("navigates to login when 'Sign In' button is clicked", async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    renderWithRouter(<LandingPage />);

    const loginBtn = await screen.findByText(/Sign In/i);
    fireEvent.click(loginBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("shows welcome text when user is logged in", async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: { user: { email: "test@example.com" } } } });

    renderWithRouter(<LandingPage />);

    expect(await screen.findByText(/Welcome, test@example.com/i)).toBeInTheDocument();
    const dashboardBtn = screen.getByText(/Dashboard/i);
    fireEvent.click(dashboardBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/user-dashboard");
  });

  it("renders feature cards and role cards", async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    renderWithRouter(<LandingPage />);

    // Feature cards
    const featureCard = await screen.findByText(/Precision Analytics/i);
    expect(featureCard).toBeInTheDocument();

    // Role cards
    const roleCard = screen.getByText(/For Coaches/i);
    expect(roleCard).toBeInTheDocument();
  });
});
