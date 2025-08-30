// __tests__/LandingPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import LandingPage from "../pages/landingPage"; // adjust path if needed
import { vi } from "vitest";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LandingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login and signup buttons", () => {
    render(<LandingPage />);

    expect(screen.getByText(/Login →/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up →/i)).toBeInTheDocument();
  });

  it("navigates to /login when login button is clicked", () => {
    render(<LandingPage />);

    const loginBtn = screen.getByText(/Login →/i);
    fireEvent.click(loginBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("navigates to /signup when signup button is clicked", () => {
    render(<LandingPage />);

    const signupBtn = screen.getByText(/Sign Up →/i);
    fireEvent.click(signupBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });

  it("renders slogan and goal text", () => {
    render(<LandingPage />);

    expect(screen.getByText(/RELIABLE SERVICE/i)).toBeInTheDocument();
    expect(screen.getByText(/THE MOST/i)).toBeInTheDocument();
  });
});
