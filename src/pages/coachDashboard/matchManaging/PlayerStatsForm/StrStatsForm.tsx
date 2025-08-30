import React, { useState } from "react";

interface Props {
  onSave: (stats: Record<string, number>) => void;
}

const StrStatsForm: React.FC<Props> = ({ onSave }) => {
  const [form, setForm] = useState({
    Shots: 0,
    ShotsOnTarget: 0,
    dribblesAttempted: 0,
    dribblesSuccessful: 0,
    offsides: 0,
  });

  return (
    <form onSubmit={e => {e.preventDefault(); onSave(form);}}>
      {Object.keys(form).map((field) => (
        <div key={field}>
          <label>{field}</label>
          <input type="number" value={(form as any)[field]} onChange={e => setForm({...form, [field]: +e.target.value})} />
        </div>
      ))}
      <button type="submit">Save</button>
    </form>
  );
};

export default StrStatsForm;
