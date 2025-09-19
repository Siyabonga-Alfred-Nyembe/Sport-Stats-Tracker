import request from "supertest";
import { describe, it, beforeEach, expect, vi } from "vitest";
import app from "../../API's/server";

// --- Supabase Mocks ---
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockOrder = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: () => ({
      select: mockSelect.mockReturnThis(),
      eq: mockEq.mockReturnThis(),
      maybeSingle: mockSingle,
      single: mockSingle,
      insert: mockInsert.mockReturnThis(),
      update: mockUpdate.mockReturnThis(),
      delete: mockDelete.mockReturnThis(),
      order: mockOrder.mockReturnThis(),
    }),
    auth: { getSession: vi.fn() },
  })),
}));

describe("API Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Health ---
  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });


  // --- Teams ---
  it("GET /teams/:teamId returns a team", async () => {
    mockSingle.mockResolvedValue({ data: { id: "team1", name: "My Team" }, error: null });
    const res = await request(app).get("/teams/team1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "team1", name: "My Team" });
  });

  it("GET /teams/:teamId handles not found", async () => {
    mockSingle.mockResolvedValue({ data: null, error: null });
    const res = await request(app).get("/teams/unknown");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Team not found" });
  });

  it("POST /teams creates a team", async () => {
    mockSingle.mockResolvedValue({ data: { id: "team1", name: "New Team" }, error: null });
    const res = await request(app).post("/teams").send({ id: "team1", name: "New Team" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "team1", name: "New Team" });
  });

  it("PUT /teams/:teamId updates a team", async () => {
    mockSingle.mockResolvedValue({ data: { id: "team1", name: "Updated Team" }, error: null });
    const res = await request(app).put("/teams/team1").send({ name: "Updated Team" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "team1", name: "Updated Team" });
  });

  // --- Players ---
  it("GET /teams/:teamId/players returns players", async () => {
    mockSelect.mockReturnValueOnce({
      eq: () => ({
        order: async () => ({ data: [{ id: "p1", name: "Player One" }], error: null }),
      }),
    });
    const res = await request(app).get("/teams/team1/players");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: "p1", name: "Player One" }]);
  });

  it("POST /teams/:teamId/players creates player", async () => {
    mockSingle.mockResolvedValue({ data: { id: "p1", name: "Player One" }, error: null });
    const res = await request(app).post("/teams/team1/players").send({ name: "Player One" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "p1", name: "Player One" });
  });

  it("PUT /players/:playerId updates player", async () => {
    mockSingle.mockResolvedValue({ data: { id: "p1", name: "Updated Player" }, error: null });
    const res = await request(app).put("/players/p1").send({ name: "Updated Player" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "p1", name: "Updated Player" });
  });

  it("DELETE /players/:playerId deletes player", async () => {
    mockDelete.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    const res = await request(app).delete("/players/p1");
    expect(res.status).toBe(204);
  });

  // --- Matches ---
  it("GET /teams/:teamId/matches returns matches", async () => {
    mockSelect.mockReturnValueOnce({
      eq: () => ({
        order: async () => ({ data: [{ id: "m1", opponent_name: "Opp" }], error: null }),
      }),
    });
    const res = await request(app).get("/teams/team1/matches");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: "m1", opponent_name: "Opp" }]);
  });

  it("POST /teams/:teamId/matches creates match", async () => {
    mockSingle.mockResolvedValue({
      data: { id: "m1", opponent_name: "Opponent", date: "2024-01-01" },
      error: null,
    });
    const res = await request(app)
      .post("/teams/team1/matches")
      .send({ opponent_name: "Opponent", date: "2024-01-01" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "m1", opponent_name: "Opponent", date: "2024-01-01" });
  });

  it("PUT /matches/:matchId updates match", async () => {
    mockSingle.mockResolvedValue({ data: { id: "m1", opponent_name: "Updated Opp" }, error: null });
    const res = await request(app).put("/matches/m1").send({ opponent_name: "Updated Opp" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "m1", opponent_name: "Updated Opp" });
  });

  it("DELETE /matches/:matchId deletes match", async () => {
    mockDelete.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    const res = await request(app).delete("/matches/m1");
    expect(res.status).toBe(204);
  });

  // --- Match Events ---
  it("GET /matches/:matchId/events returns events", async () => {
    mockSelect.mockReturnValueOnce({
      eq: () => ({
        order: async () => ({ data: [{ id: "e1", type: "goal" }], error: null }),
      }),
    });
    const res = await request(app).get("/matches/m1/events");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: "e1", type: "goal" }]);
  });

  it("DELETE /events/:eventId deletes event", async () => {
    mockDelete.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    const res = await request(app).delete("/events/e1");
    expect(res.status).toBe(204);
  });
});
