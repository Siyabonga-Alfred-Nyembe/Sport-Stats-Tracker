// src/components/__tests__/DashboardSidebar.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DashboardSidebar from "../pages/coachDashboard/DashboardSidebar";

describe("DashboardSidebar", () => {

  it("sidebar is closed by default", () => {
    const mockNavigate = vi.fn();
    render(<DashboardSidebar onNavigate={mockNavigate} />);

    const sidebar = screen.getByRole("complementary"); // <aside> maps to 'complementary'
    expect(sidebar.classList.contains("open")).toBe(false);
  });

  it("opens sidebar when hamburger menu is clicked", () => {
    const mockNavigate = vi.fn();
    render(<DashboardSidebar onNavigate={mockNavigate} />);

    const hamburger = screen.getByLabelText("Toggle navigation menu");
    fireEvent.click(hamburger);

    const sidebar = screen.getByRole("complementary");
    expect(sidebar.classList.contains("open")).toBe(true);
  });


  it("closes sidebar when close button is clicked", () => {
    const mockNavigate = vi.fn();
    render(<DashboardSidebar onNavigate={mockNavigate} />);

    fireEvent.click(screen.getByLabelText("Toggle navigation menu")); // open sidebar
    fireEvent.click(screen.getByText("×")); // close button

    const sidebar = screen.getByRole("complementary");
    expect(sidebar.classList.contains("open")).toBe(false);
  });

  it("calls onNavigate and closes sidebar when nav button is clicked", () => {
    const mockNavigate = vi.fn();
    render(<DashboardSidebar onNavigate={mockNavigate} />);

    fireEvent.click(screen.getByLabelText("Toggle navigation menu")); // open sidebar
    fireEvent.click(screen.getByText("Players")); // click nav button

    expect(mockNavigate).toHaveBeenCalledWith("players");

    const sidebar = screen.getByRole("complementary");
    expect(sidebar.classList.contains("open")).toBe(false);
  });
});
