import React, { useState } from "react";

interface Props {
  onSave: (stats: Record<string, number>) => void;
}

const MidStatsForm: React.FC<Props> = ({ onSave }) => {
  const [form, setForm] = useState({
    passesSuccessful: 0,
    passesAttempted: 0,
    interceptions: 0,
    tackles: 0,
  });

  return (
    <form onSubmit={e => {e.preventDefault(); onSave(form);}}>
      {Object.keys(form).map((field) => (
        <div key={field}>
          <label>{field}</label>
          <input type="number" style={{color:'white'}} value={(form as any)[field]} onChange={e => setForm({...form, [field]: +e.target.value})} />
        </div>
      ))}
      <button type="submit">Save</button>
    </form>
  );
};

export default MidStatsForm;
