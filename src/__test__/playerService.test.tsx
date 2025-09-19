import { describe, it, expect, vi, beforeEach } from "vitest";
import * as playerService from "../services/playerService";

const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockIn = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockSingle = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

const queryBuilder = {
  select: mockSelect,
  eq: mockEq,
  in: mockIn,
  order: mockOrder,
  limit: mockLimit,
  single: mockSingle,
  insert: mockInsert,
  update: mockUpdate,
  delete: mockDelete,
};

vi.mock("../../supabaseClient.ts", () => ({
  default: {
    from: vi.fn(() => queryBuilder),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

// --- Mock data ---
const mockPlayer1 = {
  id: "p1",
  team_id: "t1",
  name: "John Doe",
  position: "Forward",
  jersey_num: "10",
  image_url: null,
};

const mockPlayer2 = {
  id: "p2",
  team_id: "t1",
  name: "Jane Doe",
  position: "Midfielder",
  jersey_num: "8",
  image_url: null,
};

describe("playerService full coverage", () => {
  // --- fetchPlayers ---
  it("fetchPlayers returns players", async () => {
    mockSelect.mockResolvedValueOnce({ data: [mockPlayer1, mockPlayer2], error: null });
    const players = await playerService.fetchPlayers();
    expect(players).toHaveLength(2);
    expect(players[0]).toMatchObject(mockPlayer1);
  });

  it("fetchPlayers returns empty array on error", async () => {
    mockSelect.mockResolvedValueOnce({ data: null, error: new Error("fail") });
    const players = await playerService.fetchPlayers();
    expect(players).toEqual([]);
  });

  it("fetchPlayersWithStats returns [] if no players", async () => {
    mockSelect.mockResolvedValueOnce({ data: [], error: null });
    const result = await playerService.fetchPlayersWithStats("t1");
    expect(result).toEqual([]);
  });

  it("fetchPlayersWithStats returns [] on error", async () => {
    mockSelect.mockResolvedValueOnce({ data: null, error: new Error("fail") });
    const result = await playerService.fetchPlayersWithStats("t1");
    expect(result).toEqual([]);
  });

  // --- fetchPlayerStats ---
  it("fetchPlayerStats returns null if no data", async () => {
    mockSelect.mockResolvedValueOnce({ data: [], error: null });
    const stats = await playerService.fetchPlayerStats("p1");
    expect(stats).toBeNull();
  });

  it("fetchPlayerStats returns null on error", async () => {
    mockSelect.mockResolvedValueOnce({ data: null, error: new Error("fail") });
    const stats = await playerService.fetchPlayerStats("p1");
    expect(stats).toBeNull();
  });

  it("fetchAggregatedStatsForPlayers returns {} if no ids", async () => {
    const result = await playerService.fetchAggregatedStatsForPlayers([]);
    expect(result).toEqual({});
  });

  it("fetchAggregatedStatsForPlayers returns {} on error", async () => {
    mockSelect.mockReturnValue(queryBuilder);
    mockSelect.mockResolvedValueOnce({ data: null, error: new Error("fail") });
    const result = await playerService.fetchAggregatedStatsForPlayers(["p1"]);
    expect(result).toEqual({});
  });


  it("fetchPlayerStatsByMatch returns [] on error", async () => {
    mockSelect.mockResolvedValueOnce({ data: null, error: new Error("fail") });
    const result = await playerService.fetchPlayerStatsByMatch("p1");
    expect(result).toEqual([]);
  });

  it("createPlayer returns null on error", async () => {
    mockInsert.mockReturnValue(queryBuilder);
    mockSelect.mockReturnValue(queryBuilder);
    mockSingle.mockResolvedValueOnce({ data: null, error: new Error("fail") });

    const id = await playerService.createPlayer({
      team_id: "t1",
      name: "New Player",
      position: "Midfielder",
      jersey_num: "8",
      image_url: null,
    });

    expect(id).toBeNull();
  });

  // --- updatePlayer ---
  it("updatePlayer returns true on success", async () => {
    mockUpdate.mockReturnValue(queryBuilder);
    mockEq.mockResolvedValueOnce({ error: null });

    const ok = await playerService.updatePlayer("p1", { name: "Updated" });
    expect(ok).toBe(true);
  });

  it("updatePlayer returns false on error", async () => {
    mockUpdate.mockReturnValue(queryBuilder);
    mockEq.mockResolvedValueOnce({ error: new Error("fail") });

    const ok = await playerService.updatePlayer("p1", { name: "Updated" });
    expect(ok).toBe(false);
  });

  it("deletePlayer returns true on success", async () => {
    mockDelete.mockReturnValue(queryBuilder);
    mockEq.mockResolvedValueOnce({ error: null });

    const ok = await playerService.deletePlayer("p1");
    expect(ok).toBe(true);
  });

  it("deletePlayer returns false on error", async () => {
    mockDelete.mockReturnValue(queryBuilder);
    mockEq.mockResolvedValueOnce({ error: new Error("fail") });

    const ok = await playerService.deletePlayer("p1");
    expect(ok).toBe(false);
  });
});
