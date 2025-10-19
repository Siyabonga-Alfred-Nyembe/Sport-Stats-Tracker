import React, { useState, useEffect } from "react";
import { useConstructors, useDrivers } from './F1ApiBackend';

const countryFlags: Record<string, string> = {
  'NLD': '🇳🇱', 'MEX': '🇲🇽', 'GBR': '🇬🇧', 'AUS': '🇦🇺', 
  'MCO': '🇲🇨', 'ESP': '🇪🇸', 'GER': '🇩🇪', 'CAN': '🇨🇦',
  'FRA': '🇫🇷', 'THA': '🇹🇭', 'CHN': '🇨🇳', 'JPN': '🇯🇵',
  'FIN': '🇫🇮', 'DNK': '🇩🇰', 'USA': '🇺🇸', 'ITA': '🇮🇹',
  'DEU': '🇩🇪', 'AUT': '🇦🇹', 'BEL': '🇧🇪', 'BRA': '🇧🇷',
};

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

const F1StatsPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const { constructorStats, loading: constructorsLoading, refetchStats } = useConstructors();
  const { drivers, loading: driversLoading } = useDrivers();

  // Fetch constructor stats when year changes
  useEffect(() => {
    if (year) {
      refetchStats(parseInt(year));
    }
  }, [year, refetchStats]);

  const loading = constructorsLoading || driversLoading;

  if (loading) {
    return (
      <section className="f1-page" aria-labelledby="stats-title">
        <h3 id="stats-title">Season Standings</h3>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          Loading standings...
        </div>
      </section>
    );
  }

  // Sort constructors by position
  const sortedConstructors = [...(constructorStats || [])].sort(
    (a, b) => a.stats.position - b.stats.position
  );

  // Get active drivers with team info
  const activeDrivers = drivers?.filter(d => d.current_team_name) || [];

  return (
    <section className="f1-page" aria-labelledby="stats-title">
      <h3 id="stats-title">Season Standings</h3>

      <label htmlFor="year-select" className="f1-label">
        Select year:
      </label>
      <select
        id="year-select"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="f1-dropdown"
        aria-label="Select Formula 1 season year"
      >
        {Array.from({ length: 5 }, (_, i) => currentYear - i).map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      {/* Constructor Standings */}
      <section aria-labelledby="constructor-standings">
        <h4 id="constructor-standings" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff' }}>
          Constructor Standings ({year})
        </h4>
        <table className="f1-table" aria-describedby="constructor-standings">
          <thead>
            <tr>
              <th scope="col">Pos</th>
              <th scope="col">Team</th>
              <th scope="col">Points</th>
              <th scope="col">Wins</th>
              <th scope="col">Podiums</th>
            </tr>
          </thead>
          <tbody>
            {sortedConstructors.length > 0 ? (
              sortedConstructors.map((t) => (
                <tr key={t.constructorId}>
                  <td>{t.stats.position}</td>
                  <td>{t.constructorName}</td>
                  <td>{t.stats.points}</td>
                  <td>{t.stats.wins}</td>
                  <td>{t.stats.podiums}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                  No constructor standings available for {year}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default F1StatsPage;