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

// Each from() returns a fresh object with chainable mocks
vi.mock("../../supabaseClient", () => ({
  default: {
    from: vi.fn(() => ({
      select: mockSelect.mockReturnThis(),
      eq: mockEq.mockReturnThis(),
      in: mockIn.mockReturnThis(),
      order: mockOrder.mockReturnThis(),
      limit: mockLimit.mockReturnThis(),
      single: mockSingle,
      insert: mockInsert.mockReturnThis(),
      update: mockUpdate.mockReturnThis(),
      delete: mockDelete.mockReturnThis(),
    })),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const mockPlayer = {
  id: "p1",
  team_id: "t1",
  name: "John Doe",
  position: "Forward",
  jersey_num: "10",
  image_url: null,
};


describe("playerService MOCKED integration tests", () => {
  it("fetchPlayers returns players", async () => {
    mockSelect.mockResolvedValueOnce({ data: [mockPlayer], error: null });
    const players = await playerService.fetchPlayers();
    expect(players).toHaveLength(1);
    expect(players[0]).toMatchObject(mockPlayer);
  });
});
