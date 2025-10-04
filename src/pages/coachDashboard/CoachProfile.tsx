import { useState } from "react";
import type { DragEvent } from "react";
import "./CoachProfile.css";
import Logo from "../../images/7435680.jpg"
interface CoachProfileProps {
  initialCoachName?: string;
  initialTeamName?: string;
  initialLogo?: string;
}

export default function CoachProfile({
  initialCoachName = "Coach John Doe",
  initialTeamName = "Thunderbolts FC",
  
}: CoachProfileProps) {
  const [coachName, setCoachName] = useState(initialCoachName);
  const [teamName, setTeamName] = useState(initialTeamName);
  const [teamLogo, setTeamLogo] = useState(Logo);
  const [showDropzone, setShowDropzone] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleSave = () => {
    console.log("Saved:", { coachName, teamName, teamLogo });
    alert("Profile updated successfully!");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setTeamLogo(reader.result as string);
        setShowDropzone(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="profile-card">
      <header className="profile-header">
        <h1 className="title" aria-label="Coach Profile">
          Team Profile
        </h1>
      </header>

      <section className="profile-layout">
        {/* Logo Section */}
        <figure className="profile-logo">
          <img src={teamLogo} alt={`${teamName} logo`} />
          <figcaption>{teamName}</figcaption>
          <button
            type="button"
            className="CoachBtn"
            onClick={() => setShowDropzone(!showDropzone)}
            aria-label="Update team logo"
          >
            Update Logo
          </button>
        </figure>

        {/* Dropzone */}
        {showDropzone && (
          <div
            className={`dropzone ${isDragging ? "dragging" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            aria-label="Drag and drop new logo"
          >
            <p>Drag & drop your new logo here</p>
            <p className="muted">PNG, JPG, SVG supported</p>
          </div>
        )}

        {/* Form Section */}
        <form
          className="profile-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <label htmlFor="teamName">
            Team Name
            <input
              type="text"
              id="teamName"
              aria-label="Team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </label>

          <label htmlFor="coachName">
            Coach Name
            <input
              type="text"
              id="coachName"
              aria-label="Coach name"
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
            />
          </label>

          <button type="submit" className="CoachBtn" aria-label="Save profile changes">
            Save Profile
          </button>
        </form>
      </section>
    </main>
  );
}
