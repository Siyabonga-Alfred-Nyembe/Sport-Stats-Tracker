import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import MyTeamTab from "../pages/coachDashboard/coachStatsPage/MyTeamTab";
import { useTeamData } from "../pages/coachDashboard/hooks/useTeamData";
import { fetchTeamMatches } from "../services/matchService";


vi.mock("../pages/coachDashboard/hooks/useTeamData", () => ({
  useTeamData: vi.fn(),
}));


vi.mock("../services/matchService", () => ({
  fetchTeamMatches: vi.fn(),
}));

// Mock html2canvas
vi.mock("html2canvas", () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => "data:image/png;base64,mock",
    height: 200,
    width: 400,
  }),
}));

// Mock jsPDF
const saveMock = vi.fn();

vi.mock("jspdf", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      internal: {
        pageSize: { getWidth: () => 210, getHeight: () => 297 },
      },
      addPage: vi.fn(),
      addImage: vi.fn(),
      save: saveMock,
    })),
  };
});


class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

const mockTeam = { id: "t1", name: "Team A" };
const mockMatches = [
  { id: "m1", teamId: "t1", opponentName: "B", teamScore: 2, opponentScore: 1 },
  { id: "m2", teamId: "t1", opponentName: "C", teamScore: 1, opponentScore: 1 },
];


describe("MyTeamTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock hook
    (useTeamData as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      team: mockTeam,
      isLoading: false,
      error: null,
    });

    // Mock service
    (fetchTeamMatches as unknown as jest.Mock).mockResolvedValue(mockMatches);
  });

  it("renders team stats after loading matches", async () => {
    render(<MyTeamTab />);
    
    expect(await screen.findByText("Matches Played")).toBeInTheDocument();
    expect(screen.getByText("Win %")).toBeInTheDocument();
    expect(screen.getByText("Goals For")).toBeInTheDocument();
    expect(screen.getByText("Goals Against")).toBeInTheDocument();
    expect(screen.getByText("Goal Difference")).toBeInTheDocument();
  });

  it("triggers PDF export when export button is clicked", async () => {
    render(<MyTeamTab />);
    const button = await screen.findByText("Export as PDF");
    fireEvent.click(button);

    await waitFor(() => {
      expect(saveMock).toHaveBeenCalledWith("Team A_Season_Report.pdf");
    });
  });

  it("shows error message if fetch fails", async () => {
    (fetchTeamMatches as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Failed"));

    render(<MyTeamTab />);
    expect(await screen.findByText("Failed to load match data. Please try again.")).toBeInTheDocument();
  });
});
