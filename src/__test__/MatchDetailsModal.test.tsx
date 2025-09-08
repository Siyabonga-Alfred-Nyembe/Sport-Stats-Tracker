import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import MatchDetailsModal from "../pages/coachDashboard/matchManaging/MatchDetailsModal";
import type { Match, Player, MatchEvent } from "../types";

// Mock services
vi.mock("../services/matchService", () => ({
  upsertPlayerStats: vi.fn().mockResolvedValue("mock-stats-id"),
  updateMatch: vi.fn().mockResolvedValue(true),
}));

const mockMatch: Match = {
    id: "m1",
    opponentName: "Team B",
    teamScore: 2,
    opponentScore: 1,
    possession: 50,
    shots: 10,
    shotsOnTarget: 5,
    corners: 3,
    fouls: 2,
    offsides: 1,
    passes: 400,
    passAccuracy: 80,
    tackles: 7,
    saves: 2,
    status: "completed",
    date: "2025-09-08",
    teamId: ""
};

const mockPlayers: Player[] = [
  {
      id: "p1",
      name: "Player 1",
      teamId: "t1",
      position: "Forward",
      stats: {
          goals: 1,
          assists: 0,
          minutesPlayed: 90,
          shots: 5,
          shotsOnTarget: 3,
          chancesCreated: 2,
          dribblesAttempted: 4,
          dribblesSuccessful: 3,
          offsides: 1,
          tackles: 0,
          interceptions: 1,
          clearances: 0,
          saves: 0,
          cleansheets: 0,
          savePercentage: 0,
          passCompletion: 80,
          yellowCards: 0,
          redCards: 0,
          performanceData: []
      },
      jerseyNum: "",
      imageUrl: ""
  },
  {
      id: "p2",
      name: "Player 2",
      teamId: "t1",
      position: "Midfielder",
      stats: {
          goals: 0,
          assists: 1,
          minutesPlayed: 90,
          shots: 2,
          shotsOnTarget: 1,
          chancesCreated: 3,
          dribblesAttempted: 2,
          dribblesSuccessful: 2,
          offsides: 0,
          tackles: 2,
          interceptions: 1,
          clearances: 0,
          saves: 0,
          cleansheets: 0,
          savePercentage: 0,
          passCompletion: 85,
          yellowCards: 0,
          redCards: 0,
          performanceData: []
      },
      jerseyNum: "",
      imageUrl: ""
  },
];


const mockEvents: MatchEvent[] = [
  { id: "e1", matchId: "m1", playerId: "p1", eventType: "goal" },
];

describe("MatchDetailsModal", () => {
  const onClose = vi.fn();
  const onUpdateTeamStats = vi.fn();
  const onAddPlayerEvent = vi.fn();
  const onRemovePlayerEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    render(
      <MatchDetailsModal
        match={mockMatch}
        players={mockPlayers}
        events={mockEvents}
        onClose={onClose}
        onUpdateTeamStats={onUpdateTeamStats}
        onAddPlayerEvent={onAddPlayerEvent}
        onRemovePlayerEvent={onRemovePlayerEvent}
      />
    );
  });

  it("renders match details", () => {
    expect(screen.getByText("Match Details")).toBeInTheDocument();
    expect(screen.getByText("t1 vs Team B (2 - 1)")).toBeInTheDocument();
  });


  it("calls onAddPlayerEvent when adding event with player selected", async () => {
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "p1" } });
    fireEvent.click(screen.getByText("Goal ⚽"));
    expect(onAddPlayerEvent).toHaveBeenCalledWith(expect.any(String), "m1", "p1", "goal");
  });


  it("calls onRemovePlayerEvent when removing event", () => {
    fireEvent.click(screen.getByText("×", { selector: "li button" }));
    expect(onRemovePlayerEvent).toHaveBeenCalledWith("e1");
  });
});
