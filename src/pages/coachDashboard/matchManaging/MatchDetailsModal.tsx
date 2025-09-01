// src/components/Matches/MatchDetailsModal.tsx
import React, { useState } from "react";
import type { Match, Player, MatchEvent } from "../../../types";
import AdvancedStatsForm from "./PlayerStatsForm/AdvancedStatsForm";
import { createPlayerStats, updatePlayerStats } from "../../../services/matchService";
import { updateMatch } from "../../../services/matchService";
import InlineAlert from "../../components/InlineAlert";
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

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: string;
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
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { message, type, id }]);
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAddEvent = (eventType: MatchEvent["eventType"]) => {
    if (!selectedPlayerId) {
      addNotification('Please select a player first', 'warning');
      return;
    }
    const eventId = `evt-${Date.now()}`;
    onAddPlayerEvent(eventId, match.id, selectedPlayerId, eventType);
  };

  const handleSavePlayerStats = async (
    playerId: string,
    stats: Record<string, number>
  ) => {
    try {
      setIsSaving(true);
      
      // Check if stats already exist for this player in this match
      const existingStats = playerAdvancedStats[playerId];
      
      if (existingStats) {
        // Update existing stats
        const success = await updatePlayerStats(playerId, {
          ...stats,
          match_id: match.id,
          player_id: playerId,
        });
        
        if (!success) {
          throw new Error('Failed to update player stats');
        }
        addNotification('Player stats updated successfully', 'success');
      } else {
        // Create new stats record
        const statsId = await createPlayerStats({
          match_id: match.id,
          player_id: playerId,
          goals: stats.goals || 0,
          assists: stats.assists || 0,
          shots: stats.shots || 0,
          shots_on_target: stats.shotsOnTarget || 0,
          chances_created: stats.chancesCreated || 0,
          dribbles_attempted: stats.dribblesAttempted || 0,
          dribbles_successful: stats.dribblesSuccessful || 0,
          offsides: stats.offsides || 0,
          tackles: stats.tackles || 0,
          interceptions: stats.interceptions || 0,
          clearances: stats.clearances || 0,
          saves: stats.saves || 0,
          clean_sheets: stats.cleansheets || 0,
          save_percentage: stats.savePercentage || 0,
          pass_completion: stats.passCompletion || 0,
          minutes_played: stats.minutesPlayed || 0,
          yellow_cards: stats.yellowCards || 0,
          red_cards: stats.redCards || 0,
        });
        
        if (!statsId) {
          throw new Error('Failed to create player stats');
        }
        addNotification('Player stats saved successfully', 'success');
      }
      
      // Update local state
      setPlayerAdvancedStats((prev) => ({ ...prev, [playerId]: stats }));
      
    } catch (error) {
      console.error('Error saving player stats:', error);
      addNotification('Failed to save player stats. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTeamStats = async (matchId: string, stats: Partial<Match>) => {
    try {
      setIsSaving(true);
      
      // Update match in database
      const success = await updateMatch(matchId, {
        possession: stats.possession,
        shots: stats.shots,
        shots_on_target: stats.shotsOnTarget,
        corners: stats.corners,
        fouls: stats.fouls,
        offsides: stats.offsides,
        passes: stats.passes,
        pass_accuracy: stats.passAccuracy,
        tackles: stats.tackles,
        saves: stats.saves,
      });
      
      if (!success) {
        throw new Error('Failed to update team stats');
      }
      
      // Update local state
      onUpdateTeamStats(matchId, stats);
      addNotification('Team stats updated successfully', 'success');
      
    } catch (error) {
      console.error('Error updating team stats:', error);
      addNotification('Failed to update team stats. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
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

        {/* Display all notifications */}
        {notifications.map(notification => (
          <InlineAlert
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}

        {isSaving && (
          <div style={{ 
            background: 'rgba(0, 255, 0, 0.1)', 
            color: 'green', 
            padding: '1rem', 
            margin: '1rem 0', 
            borderRadius: '8px',
            border: '1px solid green'
          }}>
            Saving...
          </div>
        )}

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
                handleUpdateTeamStats(match.id, { possession: Number(e.target.value) })
              }
            />
            <label>Total Shots</label>
            <input
              type="number"
              min="0"
              defaultValue={match.shots}
              onBlur={(e) =>
                handleUpdateTeamStats(match.id, { shots: Number(e.target.value) })
              }
            />
            <label>Shots on Target</label>
            <input
              type="number"
              min="0"
              defaultValue={match.shotsOnTarget}
              onBlur={(e) =>
                handleUpdateTeamStats(match.id, { shotsOnTarget: Number(e.target.value) })
              }
            />
            <label>Corners</label>
            <input
              type="number"
              min="0"
              defaultValue={match.corners}
              onBlur={(e) =>
                handleUpdateTeamStats(match.id, { corners: Number(e.target.value) })
              }
            />
            <label>Fouls</label>
            <input
              type="number"
              min="0"
              defaultValue={match.fouls}
              onBlur={(e) =>
                handleUpdateTeamStats(match.id, { fouls: Number(e.target.value) })
              }
            />
            <label>Offsides</label>
            <input
              type="number"
              min="0"
              defaultValue={match.offsides}
              onBlur={(e) =>
                handleUpdateTeamStats(match.id, { offsides: Number(e.target.value) })
              }
            />
            <label>Passes</label>
            <input
              type="number"
              min="0"
              defaultValue={match.passes}
              onBlur={(e) =>
                handleUpdateTeamStats(match.id, { passes: Number(e.target.value) })
              }
            />
            <label>Pass Accuracy (%)</label>
            <input
              type="number"
              min="0"
              defaultValue={match.passAccuracy}
              onBlur={(e) =>
                handleUpdateTeamStats(match.id, { passAccuracy: Number(e.target.value) })
              }
            />
            <label>Tackles</label>
            <input
              type="number"
              min="0"
              defaultValue={match.tackles}
              onBlur={(e) =>
                handleUpdateTeamStats(match.id, { tackles: Number(e.target.value) })
              }
            />
            <label>Saves</label>
            <input
              type="number"
              min="0"
              defaultValue={match.saves}
              onBlur={(e) =>
                handleUpdateTeamStats(match.id, { saves: Number(e.target.value) })
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default MatchDetailsModal;
