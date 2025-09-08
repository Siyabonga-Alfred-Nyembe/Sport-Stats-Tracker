// src/__tests__/lineupService.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  saveLineup,
  loadLineup,
  updatePlayerPosition,
  addPlayerToLineup,
  removePlayerFromLineup,
  type LineupPlayer,
  type DbLineupRecord,
} from "../services/lineupService";

// --- Mock supabaseClient ---
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock("../../supabaseClient", () => {
  const mockFrom = vi.fn(() => ({
    select: mockSelect.mockReturnThis(),
    eq: mockEq.mockReturnThis(),
    order: mockOrder,
    insert: mockInsert,
    update: mockUpdate.mockReturnThis(),
    delete: mockDelete.mockReturnThis(),
  }));

  return { default: { from: mockFrom } };
});

import supabase from "../../supabaseClient";

describe("lineupService", () => {
  const teamId = "team1";

beforeEach(() => {
  vi.clearAllMocks();

  // Mock chainable methods
  mockDelete.mockReturnThis();
  mockEq.mockReturnThis();
  mockOrder.mockResolvedValue({ data: [], error: null });
  mockInsert.mockReturnValue({
    select: vi.fn().mockResolvedValue({ data: [{ id: "1" }], error: null }),
  });
  mockUpdate.mockReturnValue({
    select: vi.fn().mockResolvedValue({ data: [{ id: "1" }], error: null }),
  });
});


  it("saveLineup deletes old lineup and inserts new lineup", async () => {
    const lineup: LineupPlayer[] = [
      { playerId: "p1", positionX: 10, positionY: 20 },
      { playerId: "p2", positionX: 30, positionY: 40 },
    ];

    const result = await saveLineup(teamId, lineup);
    expect(result).toBe(true);

    expect(supabase.from).toHaveBeenCalledWith("lineups");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("team_id", teamId);
    expect(mockInsert).toHaveBeenCalledWith([
      { team_id: teamId, player_id: "p1", position_x: 10, position_y: 20 },
      { team_id: teamId, player_id: "p2", position_x: 30, position_y: 40 },
    ]);
  });

  it("loadLineup returns lineup players", async () => {
    const fakeData: DbLineupRecord[] = [
      { id: "1", team_id: teamId, player_id: "p1", position_x: 10, position_y: 20, created_at: "", updated_at: "" },
    ];

    mockOrder.mockResolvedValueOnce({ data: fakeData, error: null });

    const result = await loadLineup(teamId);
    expect(result).toEqual([{ playerId: "p1", positionX: 10, positionY: 20 }]);
  });

  it("updatePlayerPosition calls supabase.update and returns true", async () => {
    const result = await updatePlayerPosition(teamId, "p1", 50, 60);
    expect(result).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ position_x: 50, position_y: 60 }));
    expect(mockEq).toHaveBeenCalledWith("team_id", teamId);
    expect(mockEq).toHaveBeenCalledWith("player_id", "p1");
  });

  it("addPlayerToLineup inserts a new player", async () => {
    const result = await addPlayerToLineup(teamId, "p3", 15, 25);
    expect(result).toBe(true);
    expect(mockInsert).toHaveBeenCalledWith({ team_id: teamId, player_id: "p3", position_x: 15, position_y: 25 });
  });

  it("removePlayerFromLineup deletes a player", async () => {
    const result = await removePlayerFromLineup(teamId, "p1");
    expect(result).toBe(true);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("team_id", teamId);
    expect(mockEq).toHaveBeenCalledWith("player_id", "p1");
  });
});
