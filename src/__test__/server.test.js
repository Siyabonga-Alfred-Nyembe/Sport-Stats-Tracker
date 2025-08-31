import request from "supertest";
import { describe, it, beforeEach, expect, vi } from "vitest";

// Import the app (make sure your server exports `app`)
import app from "../../API's/server";

// Mock Supabase client
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockOrder = vi.fn();

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      from: () => ({
        select: mockSelect.mockReturnThis(),
        eq: mockEq.mockReturnThis(),
        maybeSingle: mockSingle,
        single: mockSingle,
        insert: mockInsert.mockReturnThis(),
        update: mockUpdate.mockReturnThis(),
        delete: mockDelete,
        order: mockOrder.mockReturnThis(),
      }),
      auth: {
        getSession: vi.fn(),
      },
    })),
  };
});

describe("API Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("GET /teams/:teamId returns a team", async () => {
    mockSingle.mockResolvedValue({ data: { id: "team1", name: "My Team" }, error: null });

    const res = await request(app).get("/teams/team1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "team1", name: "My Team" });
  });

  it("GET /teams/:teamId returns 404 if no team found", async () => {
    mockSingle.mockResolvedValue({ data: null, error: null });

    const res = await request(app).get("/teams/teamX");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Team not found");
  });

  it("POST /teams creates a new team", async () => {
    mockSingle.mockResolvedValue({ data: { id: "team1", name: "New Team" }, error: null });

    const res = await request(app)
      .post("/teams")
      .send({ id: "team1", name: "New Team" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "team1", name: "New Team" });
  });

  it("POST /teams fails if name missing", async () => {
    const res = await request(app)
      .post("/teams")
      .send({ id: "t1" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("id and name are required");
  });
});
