import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/login";
import { vi } from "vitest";

// Mock supabase
vi.mock("../../supabaseClient", () => ({
  default: {
    auth: {
      signInWithOAuth: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    },
  },
}));

describe("Login Component", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders login header and Google button", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Header
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();

    // Google login button
    expect(
      screen.getByRole("button", { name: /continue with google/i })
    ).toBeInTheDocument();

    // Signup link
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
  });

  it("calls supabase.auth.signInWithOAuth when Google button is clicked", async () => {
    const { default: supabase } = await import("../../supabaseClient");

    render(
      <BrowserRouter>
        <Login />
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

  // it("displays an error message if Google login fails", async () => {
  //   const { default: supabase } = await import("../../supabaseClient");
  //   supabase.auth.signInWithOAuth.mockResolvedValueOnce({
  //     data: null,
  //     error: { message: "Google sign-in error" },
  //   });

  //   render(
  //     <BrowserRouter>
  //       <Login />
  //     </BrowserRouter>
  //   );

  //   const googleButton = screen.getByRole("button", {
  //     name: /continue with google/i,
  //   });

  //   fireEvent.click(googleButton);

  //   // Wait for error message to show up
  //   expect(await screen.findByText(/google sign-in error/i)).toBeInTheDocument();
  // });
});
