import React from 'react';
import { useDrivers } from './F1ApiBackend';
import './F1DriversPage.css';

// Map country codes to flag emojis
const countryFlags: Record<string, string> = {
  'NLD': '🇳🇱', 'MEX': '🇲🇽', 'GBR': '🇬🇧', 'AUS': '🇦🇺', 
  'MCO': '🇲🇨', 'ESP': '🇪🇸', 'GER': '🇩🇪', 'CAN': '🇨🇦',
  'FRA': '🇫🇷', 'THA': '🇹🇭', 'CHN': '🇨🇳', 'JPN': '🇯🇵',
  'FIN': '🇫🇮', 'DNK': '🇩🇰', 'USA': '🇺🇸', 'ITA': '🇮🇹',
};

// Map team names to colors
const teamColors: Record<string, { primary: string; accent: string }> = {
  'Red Bull': { primary: '#0600EF', accent: '#FF1801' },
  'McLaren': { primary: '#FF8700', accent: '#47C7FC' },
  'Ferrari': { primary: '#DC0000', accent: '#FFF500' },
  'Mercedes': { primary: '#00D2BE', accent: '#00D2BE' },
  'Aston Martin': { primary: '#006F62', accent: '#00D2BE' },
  'Alpine F1 Team': { primary: '#0090FF', accent: '#FF1801' },
  'Williams': { primary: '#005AFF', accent: '#FFFFFF' },
  'RB F1 Team': { primary: '#2B4562', accent: '#6692FF' },
  'Haas F1 Team': { primary: '#FFFFFF', accent: '#B6BABD' },
  'Sauber': { primary: '#00E701', accent: '#000000' },
};

interface Driver {
  id: string;
  full_name: string;
  given_name: string;
  family_name: string;
  code: string;
  current_team_name: string | null;
  image_url: string | null;
  country_code: string;
  driver_number: number;
}

interface DriverCardProps {
  driver: Driver;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver }) => {
  const teamName = driver.current_team_name || 'No Team';
  const colors = teamColors[teamName] || { primary: '#e10600', accent: '#ffffff' };
  
  return (
    <div 
      className="driver-card"
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}dd 50%, ${colors.primary}88 100%)`,
      }}
    >
      <div className="driver-card-pattern"></div>
      
      <div className="driver-card-header">
        <div className="driver-info">
          <h3 className="driver-first-name">{driver.given_name}</h3>
          <h2 className="driver-last-name">{driver.family_name}</h2>
          <p className="driver-team">{teamName}</p>
        </div>
        <div className="driver-number">{driver.driver_number}</div>
      </div>

      <div className="driver-image-container">
        {driver.image_url && (
          <img 
            src={driver.image_url} 
            alt={driver.full_name}
            className="driver-image"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>

      <div className="driver-card-footer">
        <span className="driver-nationality">
          {countryFlags[driver.country_code] || '🏁'}
        </span>
      </div>
    </div>
  );
};

const F1DriversPage: React.FC = () => {
  const { drivers, loading, error } = useDrivers();

  if (loading) {
    return (
      <div className="f1-drivers-page">
        <h1 className="page-main-title">{new Date().getFullYear()} Drivers</h1>
        <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏎️</div>
          <p>Loading drivers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="f1-drivers-page">
        <h1 className="page-main-title">{new Date().getFullYear()} Drivers</h1>
        <div style={{ textAlign: 'center', padding: '4rem', color: '#e10600' }}>
          <p>Error loading drivers: {error.message}</p>
        </div>
      </div>
    );
  }

  // Filter only current drivers and group by team
  const currentDrivers = drivers?.filter(d => d.current_team_name) || [];
  
  const groupedDrivers = currentDrivers.reduce((acc, driver) => {
    const team = driver.current_team_name || 'No Team';
    if (!acc[team]) {
      acc[team] = [];
    }
    acc[team].push(driver);
    return acc;
  }, {} as Record<string, Driver[]>);

  const currentYear = new Date().getFullYear();

  return (
    <div className="f1-drivers-page">
      <h1 className="page-main-title">{currentYear} Drivers</h1>

      {Object.entries(groupedDrivers).map(([team, teamDrivers]) => (
        <div key={team} className="f1-team-section">
          <div className="team-header">
            <h2>{team}</h2>
          </div>
          <div className="drivers-grid">
            {teamDrivers.map(driver => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default F1DriversPage;