import React from 'react';
import './F1DriversPage.css';

const mockDrivers = [
  { 
    id: "1", 
    name: "Max Verstappen", 
    firstName: "Max",
    lastName: "Verstappen",
    team: "Red Bull Racing", 
    teamShort: "Red Bull",
    number: "1",
    points: 410, 
    image: "/images/max.png",
    nationality: "🇳🇱",
    teamColor: "#0600EF",
    teamAccent: "#FF1801"
  },
  { 
    id: "2", 
    name: "Sergio Pérez", 
    firstName: "Sergio",
    lastName: "Pérez",
    team: "Red Bull Racing", 
    teamShort: "Red Bull",
    number: "11",
    points: 240, 
    image: "/images/perez.png",
    nationality: "🇲🇽",
    teamColor: "#0600EF",
    teamAccent: "#FF1801"
  },
  { 
    id: "3", 
    name: "Lando Norris", 
    firstName: "Lando",
    lastName: "Norris",
    team: "McLaren", 
    teamShort: "McLaren",
    number: "4",
    points: 298, 
    image: "/images/lando.png",
    nationality: "🇬🇧",
    teamColor: "#FF8700",
    teamAccent: "#FF8700"
  },
  { 
    id: "4", 
    name: "Oscar Piastri", 
    firstName: "Oscar",
    lastName: "Piastri",
    team: "McLaren", 
    teamShort: "McLaren",
    number: "81",
    points: 257, 
    image: "/images/piastri.png",
    nationality: "🇦🇺",
    teamColor: "#FF8700",
    teamAccent: "#FF8700"
  },
  { 
    id: "5", 
    name: "Charles Leclerc", 
    firstName: "Charles",
    lastName: "Leclerc",
    team: "Ferrari", 
    teamShort: "Ferrari",
    number: "16",
    points: 277, 
    image: "/images/leclerc.png",
    nationality: "🇲🇨",
    teamColor: "#DC0000",
    teamAccent: "#FFF500"
  },
  { 
    id: "6", 
    name: "Carlos Sainz", 
    firstName: "Carlos",
    lastName: "Sainz",
    team: "Ferrari", 
    teamShort: "Ferrari",
    number: "55",
    points: 244, 
    image: "/images/sainz.png",
    nationality: "🇪🇸",
    teamColor: "#DC0000",
    teamAccent: "#FFF500"
  },
  { 
    id: "7", 
    name: "George Russell", 
    firstName: "George",
    lastName: "Russell",
    team: "Mercedes", 
    teamShort: "Mercedes",
    number: "63",
    points: 192, 
    image: "/images/russell.png",
    nationality: "🇬🇧",
    teamColor: "#00D2BE",
    teamAccent: "#00D2BE"
  },
  { 
    id: "8", 
    name: "Lewis Hamilton", 
    firstName: "Lewis",
    lastName: "Hamilton",
    team: "Mercedes", 
    teamShort: "Mercedes",
    number: "44",
    points: 190, 
    image: "/images/hamilton.png",
    nationality: "🇬🇧",
    teamColor: "#00D2BE",
    teamAccent: "#00D2BE"
  },
];

interface Driver {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  team: string;
  teamShort: string;
  number: string;
  points: number;
  image: string;
  nationality: string;
  teamColor: string;
  teamAccent: string;
}

interface DriverCardProps {
  driver: Driver;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver }) => {
  return (
    <div 
      className="driver-card"
      style={{
        background: `linear-gradient(135deg, ${driver.teamColor} 0%, ${driver.teamColor}dd 50%, ${driver.teamColor}88 100%)`,
      }}
    >
      <div className="driver-card-pattern"></div>
      
      <div className="driver-card-header">
        <div className="driver-info">
          <h3 className="driver-first-name">{driver.firstName}</h3>
          <h2 className="driver-last-name">{driver.lastName}</h2>
          <p className="driver-team">{driver.teamShort}</p>
        </div>
        <div className="driver-number">{driver.number}</div>
      </div>

      <div className="driver-image-container">
        <img 
          src={driver.image} 
          alt={driver.name}
          className="driver-image"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <div className="driver-card-footer">
        <span className="driver-nationality">{driver.nationality}</span>
      </div>
    </div>
  );
};

const F1DriversPage: React.FC = () => {
  const groupedDrivers = mockDrivers.reduce((acc, driver) => {
    if (!acc[driver.team]) {
      acc[driver.team] = [];
    }
    acc[driver.team].push(driver);
    return acc;
  }, {} as Record<string, Driver[]>);

  return (
    <div className="f1-drivers-page">
      <h1 className="page-main-title">2024 Drivers</h1>

      {Object.entries(groupedDrivers).map(([team, drivers]) => (
        <div key={team} className="f1-team-section">
          <div className="team-header">
            <h2>{team}</h2>
          </div>
          <div className="drivers-grid">
            {drivers.map(driver => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default F1DriversPage;