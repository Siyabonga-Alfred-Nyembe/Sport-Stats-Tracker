// src/components/PlayerManagement/StatsTable.tsx
import React from 'react';
import type { PlayerStats } from '../../../types';

interface Props {
  stats: PlayerStats;
}

const StatsTable: React.FC<Props> = ({ stats }) => {
  // Convert stat names from camelCase to Title Case
  const formatLabel = (key: string) => {
    const result = key.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  return (
    <div className="stats-table">
      {Object.entries(stats)
        .filter(([key]) => key !== 'performanceData') // Exclude data used for chart
        .map(([key, value]) => (
          <div key={key} className="stat-row">
            <span className="stat-key">{formatLabel(key)}</span>
            <span className="stat-value">{value}</span>
          </div>
        ))}
    </div>
  );
};

export default StatsTable;