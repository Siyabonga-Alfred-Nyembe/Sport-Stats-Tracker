// src/components/Matches/MatchDetailsModal.tsx
import React, { useState } from "react";
import type { Match, Player, MatchEvent } from "../../../types";
import AdvancedStatsForm from "./PlayerStatsForm/AdvancedStatsForm";
import "./MatchesPage.css"; // your modal + glassy styles

interface Props {
  match: Match;
  players: Player[];
  events: MatchEvent[];
  onClose: () => void;
  onUpdateTeamStats: (matchId: string, stats: Partial<Match>) => void;
  onAddPlayerEvent: (
    eventId: string,
    matchId: string,
    playerId: string,
    eventType: MatchEvent["eventType"]
  ) => void;
  onRemovePlayerEvent: (eventId: string) => void;
}

const MatchDetailsModal: React.FC<Props> = ({
  match,
  players,
  events,
  onClose,
  onUpdateTeamStats,
  onAddPlayerEvent,
  onRemovePlayerEvent,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [playerAdvancedStats, setPlayerAdvancedStats] = useState<
    Record<string, any>
  >({});

  const handleAddEvent = (eventType: MatchEvent["eventType"]) => {
    if (!selectedPlayerId) return;
    const eventId = `evt-${Date.now()}`;
    onAddPlayerEvent(eventId, match.id, selectedPlayerId, eventType);
  };

  const handleSavePlayerStats = (
    playerId: string,
    stats: Record<string, number>
  ) => {
    setPlayerAdvancedStats((prev) => ({ ...prev, [playerId]: stats }));
    console.log("Mock saved stats:", playerId, stats);
  };

  const getPlayerName = (playerId: string) =>
    players.find((p) => p.id === playerId)?.name || "Unknown Player";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <h2 className="section-title">Match Details</h2>
        <h3>
          {players[0]?.teamId} vs {match.opponentName} ({match.teamScore} -{" "}
          {match.opponentScore})
        </h3>

        {/* --- Player Events Section --- */}
        <section className="stat-section">
          <h4>Player Events</h4>
          <div className="event-form">
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
            >
              <option value="">Select Player...</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (#{p.jerseyNum})
                </option>
              ))}
            </select>
            <div className="event-buttons">
              <button
                onClick={() => handleAddEvent("goal")}
                disabled={!selectedPlayerId}
              >
                Goal ⚽
              </button>
              <button
                onClick={() => handleAddEvent("assist")}
                disabled={!selectedPlayerId}
              >
                Assist 👟
              </button>
              <button
                onClick={() => handleAddEvent("yellow_card")}
                className="yellow"
                disabled={!selectedPlayerId}
              >
                Yellow Card 🟨
              </button>
              <button
                onClick={() => handleAddEvent("red_card")}
                className="red"
                disabled={!selectedPlayerId}
              >
                Red Card 🟥
              </button>
            </div>
          </div>
          <ul className="event-list">
            {events.map((event) => (
              <li key={event.id}>
                <span>
                  {event.eventType.replace("_", " ")}:{" "}
                  <strong>{getPlayerName(event.playerId)}</strong>
                </span>
                <button onClick={() => onRemovePlayerEvent(event.id)}>
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* --- Advanced Player Stats Section --- */}
        {selectedPlayerId && (
          <AdvancedStatsForm
            player={players.find((p) => p.id === selectedPlayerId)!}
            onSave={handleSavePlayerStats}
          />
        )}

        {/* --- Team Stats Section --- */}
        <section className="stat-section">
          <h4>Team Stats</h4>
          <div className="team-stats-form">
            <label>Possession (%)</label>
            <input
              type="number"
              min="0"
              defaultValue={match.possession}
              onBlur={(e) =>
                onUpdateTeamStats(match.id, { possession: Number(e.target.value) })
              }
            />
            <label>Total Shots</label>
            <input
              type="number"
              min="0"
              defaultValue={match.shots}
              onBlur={(e) =>
                onUpdateTeamStats(match.id, { shots: Number(e.target.value) })
              }
            />
            <label>Shots on Target</label>
            <input
              type="number"
              min="0"
              defaultValue={match.shotsOnTarget}
              onBlur={(e) =>
                onUpdateTeamStats(match.id, { shotsOnTarget: Number(e.target.value) })
              }
            />
            <label>Corners</label>
            <input
              type="number"
              min="0"
              defaultValue={match.corners}
              onBlur={(e) =>
                onUpdateTeamStats(match.id, { corners: Number(e.target.value) })
              }
            />
            <label>Fouls</label>
            <input
              type="number"
              min="0"
              defaultValue={match.fouls}
              onBlur={(e) =>
                onUpdateTeamStats(match.id, { fouls: Number(e.target.value) })
              }
            />
            <label>Offsides</label>
            <input
              type="number"
              min="0"
              defaultValue={match.offsides}
              onBlur={(e) =>
                onUpdateTeamStats(match.id, { offsides: Number(e.target.value) })
              }
            />
            <label>Passes</label>
            <input
              type="number"
              min="0"
              defaultValue={match.passes}
              onBlur={(e) =>
                onUpdateTeamStats(match.id, { passes: Number(e.target.value) })
              }
            />
            <label>Pass Accuracy (%)</label>
            <input
              type="number"
              min="0"
              defaultValue={match.passAccuracy}
              onBlur={(e) =>
                onUpdateTeamStats(match.id, { passAccuracy: Number(e.target.value) })
              }
            />
            <label>Tackles</label>
            <input
              type="number"
              min="0"
              defaultValue={match.tackles}
              onBlur={(e) =>
                onUpdateTeamStats(match.id, { tackles: Number(e.target.value) })
              }
            />
            <label>Saves</label>
            <input
              type="number"
              min="0"
              defaultValue={match.saves}
              onBlur={(e) =>
                onUpdateTeamStats(match.id, { saves: Number(e.target.value) })
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default MatchDetailsModal;
