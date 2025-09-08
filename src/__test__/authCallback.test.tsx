import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AuthCallback from "../pages/authCallback";
import supabase from "../../supabaseClient";

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockSingle = vi.fn();
vi.mock("../../supabaseClient", () => {
  return {
    default: {
      auth: {
        getSession: vi.fn(),
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: mockSingle,
          })),
        })),
      })),
    },
  };
});

describe("AuthCallback Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockSingle.mockReset();
  });

  it("renders loading text", () => {
    render(<AuthCallback />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("redirects to /login if supabase session has error", async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: { message: "error" },
    });

    render(<AuthCallback />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("redirects to /login if session.user is null", async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    render(<AuthCallback />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("redirects to user dashboard if session exists and user_type is user", async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { id: "123", email: "user@example.com" } } },
      error: null,
    });
    mockSingle.mockResolvedValue({ data: { user_type: "user" } });

    render(<AuthCallback />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/user-dashboard", {
        state: { username: "user@example.com", userId: "123", isGoogleUser: true },
      });
    });
  });

  it("redirects to coach dashboard if session exists and user_type is coach", async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { id: "456", email: "coach@example.com" } } },
      error: null,
    });
    mockSingle.mockResolvedValue({ data: { user_type: "coach" } });

    render(<AuthCallback />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/coach-dashboard", {
        state: { username: "coach@example.com", userId: "456", isGoogleUser: true },
      });
    });
  });
});
