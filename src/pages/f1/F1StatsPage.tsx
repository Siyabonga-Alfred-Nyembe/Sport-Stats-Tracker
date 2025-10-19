import React, { useState, useEffect } from "react";
import { useConstructors, useDrivers } from './F1ApiBackend';

interface DriverStanding {
  name: string;
  team: string;
  points: number;
  position: number;
}

const F1StatsPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const { constructorStats, loading: constructorsLoading, refetchStats } = useConstructors();
  const { drivers, loading: driversLoading } = useDrivers();
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);

  // Fetch constructor stats when year changes
  useEffect(() => {
    if (year) {
      refetchStats(parseInt(year));
    }
  }, [year, refetchStats]);

  // Calculate driver standings from API data
  useEffect(() => {
    if (!drivers || !constructorStats) return;

    // This is a simplified version - in reality you'd want to call a dedicated
    // driver standings API endpoint if available
    const standings: DriverStanding[] = drivers
      .filter(d => d.current_team_name)
      .map((driver, index) => ({
        name: driver.full_name,
        team: driver.current_team_name || 'Unknown',
        points: 0, // You'd need actual points from API
        position: index + 1,
      }))
      .slice(0, 10); // Top 10

    setDriverStandings(standings);
  }, [drivers, constructorStats]);

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

      <section aria-labelledby="driver-standings">
        <h4 id="driver-standings">Driver Standings ({year})</h4>
        <table className="f1-table" aria-describedby="driver-standings">
          <thead>
            <tr>
              <th scope="col">Pos</th>
              <th scope="col">Driver</th>
              <th scope="col">Team</th>
              <th scope="col">Points</th>
            </tr>
          </thead>
          <tbody>
            {driverStandings.length > 0 ? (
              driverStandings.map((d, i) => (
                <tr key={d.name}>
                  <td>{i + 1}</td>
                  <td>{d.name}</td>
                  <td>{d.team}</td>
                  <td>{d.points}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                  No driver standings available for {year}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="constructor-standings">
        <h4 id="constructor-standings">Constructor Standings ({year})</h4>
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