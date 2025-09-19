import { renderHook, act } from "@testing-library/react";
import { useFavoriteTeams } from "../pages/userDashboard/hooks/useFavorites";
import * as favoritesService from "../services/favoritesService";
import supabase from "../../supabaseClient";
import { vi } from "vitest";


vi.mock("../../supabaseClient");
vi.mock("../services/favoritesService");

describe("useFavoriteTeams hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
    process.env.VITE_SUPABASE_URL = "mock-url";
    process.env.VITE_SUPABASE_ANON_KEY = "mock-key";
  });


  it("loads favorites from localStorage if no credentials", async () => {
    process.env.VITE_SUPABASE_URL = "";
    localStorage.setItem("rs_favorite_teams_v1", JSON.stringify(["team1"]));

    const { result } = renderHook(() => useFavoriteTeams());

    // wait for useEffect to run
    await act(async () => Promise.resolve());

    expect(result.current.favoriteTeamIds).toEqual(["team1"]);
    expect(result.current.loading).toBe(false);
  });

  it("isFavorite returns correct value", async () => {
    const { result } = renderHook(() => useFavoriteTeams());

    await act(async () => result.current.toggleFavorite("team1"));
    expect(result.current.isFavorite("team1")).toBe(true);

    await act(async () => result.current.toggleFavorite("team1"));
    expect(result.current.isFavorite("team1")).toBe(false);
  });

  it("toggleFavorite updates localStorage without credentials", async () => {
    process.env.VITE_SUPABASE_URL = "";
    const { result } = renderHook(() => useFavoriteTeams());

    await act(async () => result.current.toggleFavorite("team1"));

    expect(JSON.parse(localStorage.getItem("rs_favorite_teams_v1")!)).toEqual(["team1"]);
  });

//   it("toggleFavorite calls addFavorite/removeFavorite with credentials", async () => {
//     const mockUser = { id: "user1" };
//     (supabase.auth.getUser as any).mockResolvedValue({ data: { user: mockUser } });
//     (favoritesService.addFavorite as any).mockResolvedValue(true);
//     (favoritesService.removeFavorite as any).mockResolvedValue(true);

//     const { result } = renderHook(() => useFavoriteTeams());

//     // wait for useEffect to set userId
//     await act(async () => Promise.resolve());

//     await act(async () => result.current.toggleFavorite("team1"));
//     expect(favoritesService.addFavorite).toHaveBeenCalledWith("user1", "team1");
//     expect(result.current.favoriteTeamIds).toContain("team1");

//     await act(async () => result.current.toggleFavorite("team1"));
//     expect(favoritesService.removeFavorite).toHaveBeenCalledWith("user1", "team1");
//     expect(result.current.favoriteTeamIds).not.toContain("team1");
//   });

  it("falls back to localStorage if ensureUserProfile fails", async () => {
    const mockUser = { id: "user1" };
    (supabase.auth.getUser as any).mockResolvedValue({ data: { user: mockUser } });
    // simulate ensureUserProfile failure by mocking removeFavorite/addFavorite to fail
    (favoritesService.addFavorite as any).mockResolvedValue(false);
    (favoritesService.removeFavorite as any).mockResolvedValue(false);

    const { result } = renderHook(() => useFavoriteTeams());

    await act(async () => Promise.resolve());

    await act(async () => result.current.toggleFavorite("teamX"));
    expect(result.current.favoriteTeamIds).toContain("teamX");
    expect(JSON.parse(localStorage.getItem("rs_favorite_teams_v1")!)).toContain("teamX");
  });
});
