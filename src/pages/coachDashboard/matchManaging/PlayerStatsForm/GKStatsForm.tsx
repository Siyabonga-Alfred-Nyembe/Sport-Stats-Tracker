import React, { useState } from "react";

interface Props {
  onSave: (stats: Record<string, number>) => void;
}

const GKStatsForm: React.FC<Props> = ({ onSave }) => {
  const [form, setForm] = useState({
    saves: 0,
    clearances: 0,
    shotsAgainst: 0,
    goalsConceded: 0,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <label>Saves</label>
      <input type="number" value={form.saves} onChange={e => setForm({...form, saves: +e.target.value})} />
      <label>Clearances</label>
      <input type="number" value={form.clearances} onChange={e => setForm({...form, clearances: +e.target.value})} />
      <label>Shots Against</label>
      <input type="number" value={form.shotsAgainst} onChange={e => setForm({...form, shotsAgainst: +e.target.value})} />
      <label>Goals Conceded</label>
      <input type="number" value={form.goalsConceded} onChange={e => setForm({...form, goalsConceded: +e.target.value})} />
      <button type="submit">Save</button>
    </form>
  );
};

export default GKStatsForm;
