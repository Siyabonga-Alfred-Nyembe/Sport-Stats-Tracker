
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as matchService from "../services/matchService";

vi.mock("../../supabaseClient", () => {
  // Define chainable mocks inside the factory
  const mockSelect = vi.fn().mockResolvedValue({ data: [], error: null });
  const mockEq = vi.fn().mockReturnThis();
  const mockOrder = vi.fn().mockReturnThis();
  const mockSingle = vi.fn().mockResolvedValue({ data: { id: "mock-id" }, error: null });
  const mockInsert = vi.fn().mockReturnValue({ select: mockSelect, single: mockSingle });
  const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq, select: mockSelect });
  const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });

  const mockFrom = vi.fn().mockReturnValue({
    select: mockSelect,
    eq: mockEq,
    order: mockOrder,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    single: mockSingle,
  });

  return { default: { from: mockFrom } };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("matchService", () => {

  it("updateMatch returns true on success", async () => {
    const result = await matchService.updateMatch("match1", { team_score: 3 });
    expect(result).toBe(true);
  });


  it("deleteMatchEvent returns true", async () => {
    const result = await matchService.deleteMatchEvent("event1");
    expect(result).toBe(true);
  });
});
