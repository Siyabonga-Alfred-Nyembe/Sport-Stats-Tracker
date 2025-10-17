import React from 'react';
import './F1TeamsPage.css';

const mockTeams = [
  { 
    id: "rb", 
    name: "Red Bull Racing", 
    points: 650, 
    logo: "/images/redbull.png", 
    drivers: ["Max Verstappen", "Sergio Pérez"],
    color: "#0600EF",
    accent: "#FF1801",
    position: 1
  },
  { 
    id: "mc", 
    name: "McLaren", 
    points: 560, 
    logo: "/images/mclaren.png", 
    drivers: ["Lando Norris", "Oscar Piastri"],
    color: "#FF8700",
    accent: "#47C7FC",
    position: 2
  },
  { 
    id: "fe", 
    name: "Ferrari", 
    points: 510, 
    logo: "/images/ferrari.png", 
    drivers: ["Charles Leclerc", "Carlos Sainz"],
    color: "#DC0000",
    accent: "#FFF500",
    position: 3
  },
  { 
    id: "me", 
    name: "Mercedes", 
    points: 382, 
    logo: "/images/mercedes.png", 
    drivers: ["Lewis Hamilton", "George Russell"],
    color: "#00D2BE",
    accent: "#00D2BE",
    position: 4
  },
];

interface Team {
  id: string;
  name: string;
  points: number;
  logo: string;
  drivers: string[];
  color: string;
  accent: string;
  position: number;
}

interface TeamCardProps {
  team: Team;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  return (
    <div 
      className="f1-team-card"
      style={{
        background: `linear-gradient(135deg, ${team.color} 0%, ${team.color}dd 70%, ${team.color}aa 100%)`,
      }}
    >
      <div className="team-card-pattern"></div>
      
      <div className="team-position">
        <span className="position-number">P{team.position}</span>
      </div>

      <div className="team-logo-container">
        <img 
          src={team.logo} 
          alt={`${team.name} logo`}
          className="f1-team-logo"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <div className="team-info">
        <h2 className="f1-team-name">{team.name}</h2>
        <div className="team-drivers">
          {team.drivers.map((driver, idx) => (
            <span key={idx} className="driver-name">
              {driver}
            </span>
          ))}
        </div>
      </div>

      <div className="team-points-section">
        <div className="team-points">
          <span className="points-number">{team.points}</span>
          <span className="points-label">POINTS</span>
        </div>
      </div>

      <div 
        className="team-accent-stripe"
        style={{ background: team.accent }}
      ></div>
    </div>
  );
};

const F1TeamsPage: React.FC = () => {
  return (
    <div className="f1-teams-page">
      <div className="page-header">
        <h1 className="page-title">Constructor Standings</h1>
        <p className="page-subtitle">2024 FIA Formula One World Championship</p>
      </div>

      <div className="teams-grid">
        {mockTeams.map(team => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
};

export default F1TeamsPage;