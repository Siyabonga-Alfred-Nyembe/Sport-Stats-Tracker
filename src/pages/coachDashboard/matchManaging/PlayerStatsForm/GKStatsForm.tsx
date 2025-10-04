import React, { useState, useEffect } from "react";

interface Props {
  initialStats?: Record<string, number>; 
  onSave: (stats: Record<string, number>) => void;
}

const GKStatsForm: React.FC<Props> = ({ onSave, initialStats }) => {
  const [form, setForm] = useState({
    saves: 0,
    clearances: 0,
    goalsConceded: 0,
  });

  useEffect(() => {
    if (initialStats) {
      setForm({
        saves: initialStats.saves || 0,
        clearances: initialStats.clearances || 0,
        goalsConceded: initialStats.goalsConceded || 0,
      });
    }
  }, [initialStats]);

  // Save when form data changes
  const handleInputChange = (field: string, value: number) => {
    const newForm = { ...form, [field]: value };
    setForm(newForm);
    onSave(newForm);
  };

  return (
    <div className="position-stats-form">
      <div className="form-group">
        <label>Saves</label>
        <input type="number" value={form.saves} onChange={e => handleInputChange('saves', +e.target.value)} />
      </div>
      <div className="form-group">
        <label>Clearances</label>
        <input type="number" value={form.clearances} onChange={e => handleInputChange('clearances', +e.target.value)} />
      </div>
      <div className="form-group">
        <label>Goals Conceded</label>
        <input type="number" value={form.goalsConceded} onChange={e => handleInputChange('goalsConceded', +e.target.value)} />
      </div>
    </div>
  );
};

export default GKStatsForm;
