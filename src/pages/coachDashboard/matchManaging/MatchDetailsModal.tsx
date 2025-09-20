// src/components/Matches/MatchDetailsModal.tsx
import React, { useState, useEffect } from "react";
import type { Match, Player, MatchEvent } from "../../../types";
import AdvancedStatsForm from "./PlayerStatsForm/AdvancedStatsForm";
import { upsertPlayerStats } from "../../../services/matchService";
import { fetchPlayerStatsByMatch } from "../../../services/playerService";
import { updateMatch } from "../../../services/matchService";
import InlineAlert from "../../components/InlineAlert";
import "./MatchesPage.css"; 

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
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [basicStats, setBasicStats] = useState({
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCard: false
  });

  // Load existing stats when a player is selected
  useEffect(() => {
    const loadExistingStats = async () => {
      if (!selectedPlayerId) {
        setBasicStats({
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCard: false
        });
        return;
      }

      try {
        const existingStats = await fetchPlayerStatsByMatch(selectedPlayerId);
        const matchStats = existingStats.find((stat: any) => stat.match_id === match.id);
        
        if (matchStats) {
          setBasicStats({
            goals: matchStats.goals || 0,
            assists: matchStats.assists || 0,
            yellowCards: matchStats.yellow_cards || 0,
            redCard: (matchStats.red_cards || 0) > 0
          });
        } else {
          setBasicStats({
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCard: false
          });
        }
      } catch (error) {
        console.error('Error loading existing stats:', error);
        // Reset to default values on error
        setBasicStats({
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCard: false
        });
      }
    };

    loadExistingStats();
  }, [selectedPlayerId, match.id]);

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

  const normalizeStatsKeys = (raw: Record<string, number>) => {
    // Normalize various form field casings to db field names used in services
    return {
      goals: raw.goals ?? raw.Goals ?? 0,
      assists: raw.assists ?? raw.Assists ?? 0,
      shots: raw.shots ?? raw.Shots ?? 0,
      shotsOnTarget: raw.shotsOnTarget ?? raw.ShotsOnTarget ?? 0,
      chancesCreated: raw.chancesCreated ?? raw.ChancesCreated ?? 0,
      dribblesAttempted: raw.dribblesAttempted ?? raw.DribblesAttempted ?? 0,
      dribblesSuccessful: raw.dribblesSuccessful ?? raw.DribblesSuccessful ?? 0,
      offsides: raw.offsides ?? raw.Offsides ?? 0,
      tackles: raw.tackles ?? raw.Tackles ?? 0,
      interceptions: raw.interceptions ?? raw.Interceptions ?? 0,
      clearances: raw.clearances ?? raw.Clearances ?? 0,
      saves: raw.saves ?? raw.Saves ?? 0,
      cleansheets: raw.cleansheets ?? raw.cleanSheets ?? raw.CleanSheets ?? 0,
      savePercentage: raw.savePercentage ?? raw.SavePercentage ?? 0,
      passCompletion: raw.passCompletion ?? raw.PassCompletion ?? 0,
      minutesPlayed: raw.minutesPlayed ?? raw.MinutesPlayed ?? 0,
      yellowCards: raw.yellowCards ?? raw.YellowCards ?? 0,
      redCards: raw.redCards ?? raw.RedCards ?? 0,
    };
  };

  const handleSaveBasicStats = async () => {
    if (!selectedPlayerId) {
      addNotification('Please select a player first', 'warning');
      return;
    }

    try {
      setIsSaving(true);
      console.log('[MatchDetailsModal] handleSaveBasicStats called', { matchId: match.id, playerId: selectedPlayerId, basicStats });

      // Upsert player stats by (match_id, player_id)
      const statsId = await upsertPlayerStats(match.id, selectedPlayerId, {
        goals: basicStats.goals || 0,
        assists: basicStats.assists || 0,
        yellow_cards: basicStats.yellowCards || 0,
        red_cards: basicStats.redCard ? 1 : 0,
      });

      if (!statsId) {
        throw new Error('Failed to save player stats');
      }

      console.log('[MatchDetailsModal] Basic player stats saved successfully', { statsId, matchId: match.id, playerId: selectedPlayerId });
      addNotification('Player stats saved', 'success');
      
    } catch (error) {
      console.error('Error saving basic player stats:', error);
      addNotification('Failed to save player stats. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePlayerStats = async (
    playerId: string,
    incomingStats: Record<string, number>
  ) => {
    try {
      setIsSaving(true);
      console.log('[MatchDetailsModal] handleSavePlayerStats called', { matchId: match.id, playerId, incomingStats });

      const stats = normalizeStatsKeys(incomingStats);
      console.log('[MatchDetailsModal] Normalized stats', stats);
      // Upsert player stats by (match_id, player_id)
      const statsId = await upsertPlayerStats(match.id, playerId, {
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
        throw new Error('Failed to save player stats');
      }

      console.log('[MatchDetailsModal] Player stats saved successfully', { statsId, matchId: match.id, playerId });
      addNotification('Player stats saved', 'success');
      
      // No local cache required; data will be fetched fresh where needed
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
            <section className="team-stats-form">
              <label>Goals</label>
              <input
                type="number"
                min="0"
                value={basicStats.goals}
                onChange={(e) => setBasicStats({...basicStats, goals: parseInt(e.target.value) || 0})}
              />
              <label>Assists</label>
              <input
                type="number"
                min="0"
                value={basicStats.assists}
                onChange={(e) => setBasicStats({...basicStats, assists: parseInt(e.target.value) || 0})}
              />
              <label>Yellow Cards</label>
              <input
                type="number"
                min="0"
                value={basicStats.yellowCards}
                onChange={(e) => setBasicStats({...basicStats, yellowCards: parseInt(e.target.value) || 0})}
              />
              <label>Red Card</label>
              <input
                type="checkbox"
                checked={basicStats.redCard}
                onChange={(e) => setBasicStats({...basicStats, redCard: e.target.checked})}
              />
              <button 
                type="button" 
                onClick={handleSaveBasicStats}
                disabled={!selectedPlayerId || isSaving}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedPlayerId ? 'var(--primary)' : 'var(--muted)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: selectedPlayerId ? 'pointer' : 'not-allowed',
                  marginTop: '10px'
                }}
              >
                {isSaving ? 'Saving...' : 'Save Basic Stats'}
              </button>
            </section>
          </div>
        </section>

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
