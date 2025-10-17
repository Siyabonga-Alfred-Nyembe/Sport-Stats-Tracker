import React, { useState, useEffect } from "react";

interface Props {
  initialStats?: Record<string, number>;
  onSave: (stats: Record<string, number>) => void;
}

const MidStatsForm: React.FC<Props> = ({ onSave, initialStats }) => {
  const [form, setForm] = useState({
    passesSuccessful: 0,
    passesAttempted: 0,
    dribblesAttempted: 0,
    dribblesSuccessful: 0,
    offsides: 0,
    tackles: 0,
  });

  useEffect(() => {
    if (initialStats) {
      setForm({
        passesSuccessful: initialStats.passesSuccessful || 0,
        passesAttempted: initialStats.passesAttempted || 0,
        dribblesAttempted: initialStats.dribblesAttempted || 0,
        dribblesSuccessful: initialStats.dribblesSuccessful || 0,
        offsides: initialStats.offsides || 0,
        tackles: initialStats.tackles || 0,
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
      {Object.keys(form).map((field) => (
        <div key={field} className="form-group">
          <label style={{ color: "blue" }}>{field}</label>
          <input
            type="number"
            value={(form as any)[field]}
            onChange={(e) => handleInputChange(field, +e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default MidStatsForm;
