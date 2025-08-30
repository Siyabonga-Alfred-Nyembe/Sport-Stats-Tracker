// src/__test__/App.test.tsx
import { render, screen } from "@testing-library/react";
import App from "../App";
import { vi } from "vitest";

// Mock your pages
vi.mock("../pages/landingPage", () => ({
  default: () => <div>Landing Page</div>,
}));
vi.mock("../pages/login", () => ({
  default: () => <div>Login Page</div>,
}));
vi.mock("../pages/signup", () => ({
  default: () => <div>Signup Page</div>,
}));

describe("App Component Routing", () => {
  it("renders LandingPage at root path", () => {
    render(<App />);
    expect(screen.getByText("Landing Page")).toBeInTheDocument();
  });
});
