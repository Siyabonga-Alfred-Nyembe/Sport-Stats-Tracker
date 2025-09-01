import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Signup from "../pages/signup";
import { vi } from "vitest";

// Mock supabase
vi.mock("../../supabaseClient", () => ({
  default: {
    auth: {
      signInWithOAuth: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    },
  },
}));

describe("Signup Component", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders signup header and Google button", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Header
    expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();

    // Google sign-up button
    expect(
      screen.getByRole("button", { name: /continue with google/i })
    ).toBeInTheDocument();

    // Login link
    expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
  });

  it("calls supabase.auth.signInWithOAuth when Google button is clicked", async () => {
    const { default: supabase } = await import("../../supabaseClient");

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const googleButton = screen.getByRole("button", {
      name: /continue with google/i,
    });

    fireEvent.click(googleButton);

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: window.location.origin + "/auth-callback" },
    });
  });

});
