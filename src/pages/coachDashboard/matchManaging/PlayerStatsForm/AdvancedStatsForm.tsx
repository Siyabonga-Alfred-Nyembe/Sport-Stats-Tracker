import React, { useState } from "react";
import type { Player } from "../../../../types";
import GKStatsForm from "./GKStatsForm";
import MidStatsForm from "./MidStatsForm";
import StrStatsForm from "./StrStatsForm";
import DefStatsForm from "./DefStatsForm";
import "./PlayerStatsForm.css";

interface Props {
  player: Player;
  onSave: (playerId: string, stats: Record<string, number>) => void;
}

const AdvancedStatsForm: React.FC<Props> = ({ player, onSave }) => {
  const [stats, setStats] = useState<Record<string, number>>({});

  const handleSave = (data: Record<string, number>) => {
    setStats(data);
    onSave(player.id, data);
  };

  let form = null;
  if (player.position === "GK") form = <GKStatsForm onSave={handleSave} />;
  else if (["CAM","CDM","CAM", "CM", "LM","RM"].includes(player.position)) form = <MidStatsForm onSave={handleSave} />;
  else if (["CF","ST","LW", "RW"].includes(player.position)) form = <StrStatsForm onSave={handleSave} />;
  else if (["LWB","RWB","CB", "RB", "LB"].includes(player.position))
    form = <DefStatsForm onSave={handleSave} />;

  return (
    <div className="stats-form">
      <h5>Advanced Stats for {player.name} ({player.position})</h5>
      {form}
    </div>
  );
};

export default AdvancedStatsForm;
