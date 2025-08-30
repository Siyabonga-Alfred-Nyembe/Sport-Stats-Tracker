// src/components/PlayerManagement/KeyStatCard.tsx
import React from 'react';

interface Props {
  label: string;
  value: string | number;
}

const KeyStatCard: React.FC<Props> = ({ label, value }) => {
  return (
    <div className="rs-card key-stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default KeyStatCard;