import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProfileSettings from "../pages/ProfileSettings";

// Mock services
vi.mock("../services/profileService", () => ({
  uploadAvatar: vi.fn(),
  upsertUserProfile: vi.fn(),
  fetchUserProfile: vi.fn(),
}));

//Supabase mock
const getUserMock = vi.fn();
vi.mock("../../supabaseClient", () => {
  return {
    __esModule: true,
    default: {
      auth: {
        getUser: (...args: any[]) => getUserMock(...args),
      },
    },
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("UI Tests / ProfileSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUserMock.mockResolvedValue({
      data: { user: { id: "user123" } },
    });
  });

  it("renders header and form fields", async () => {
    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Profile Settings/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save Profile/i })).toBeInTheDocument();
  });

  it("shows placeholder initial when no picture", async () => {
    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    expect(await screen.findByText("U")).toBeInTheDocument();
  });

  it("updates name input value", () => {
    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    const input = screen.getByLabelText(/Name/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "John" } });
    expect(input.value).toBe("John");
  });

  it("shows saving state on submit", async () => {
    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /Save Profile/i });
    fireEvent.click(button);
    expect(await screen.findByRole("button", { name: /Saving.../i })).toBeInTheDocument();
  });

  it("navigates back when back button clicked", () => {
    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Back/i }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("shows success message after saving", async () => {
    const { upsertUserProfile } = await import("../services/profileService");
    (upsertUserProfile as any).mockResolvedValue({});

    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Save Profile/i }));

    expect(await screen.findByText(/Profile saved successfully!/i)).toBeInTheDocument();
  });

  it("shows error alert if saving fails", async () => {
    const { upsertUserProfile } = await import("../services/profileService");
    (upsertUserProfile as any).mockRejectedValue(new Error("fail"));

    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Save Profile/i }));

    expect(
      await screen.findByText(/We could not save your profile/i)
    ).toBeInTheDocument();
  });
});
