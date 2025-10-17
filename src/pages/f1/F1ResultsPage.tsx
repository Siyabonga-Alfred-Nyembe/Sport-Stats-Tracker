import React, { useState } from 'react';
import './F1ResultsPage.css';

const mockRaceResults = [
  {
    grandPrix: "Australia",
    date: "16 Mar",
    flag: "🇦🇺",
    winner: "Lando Norris",
    team: "McLaren",
    laps: 57,
    time: "1:42:06.304",
    fastestLap: "1:20.235"
  },
  {
    grandPrix: "China",
    date: "23 Mar",
    flag: "🇨🇳",
    winner: "Oscar Piastri",
    team: "McLaren",
    laps: 56,
    time: "1:30:55.026",
    fastestLap: "1:19.874"
  },
  {
    grandPrix: "Japan",
    date: "06 Apr",
    flag: "🇯🇵",
    winner: "Max Verstappen",
    team: "Red Bull Racing",
    laps: 53,
    time: "1:22:06.983",
    fastestLap: "1:18.945"
  },
  {
    grandPrix: "Bahrain",
    date: "13 Apr",
    flag: "🇧🇭",
    winner: "Oscar Piastri",
    team: "McLaren",
    laps: 57,
    time: "1:35:39.435",
    fastestLap: "1:21.102"
  },
  {
    grandPrix: "Saudi Arabia",
    date: "20 Apr",
    flag: "🇸🇦",
    winner: "Oscar Piastri",
    team: "McLaren",
    laps: 50,
    time: "1:21:06.758",
    fastestLap: "1:19.456"
  },
  {
    grandPrix: "Miami",
    date: "04 May",
    flag: "🇺🇸",
    winner: "Oscar Piastri",
    team: "McLaren",
    laps: 57,
    time: "1:28:51.587",
    fastestLap: "1:20.789"
  },
  {
    grandPrix: "Emilia-Romagna",
    date: "18 May",
    flag: "🇮🇹",
    winner: "Max Verstappen",
    team: "Red Bull Racing",
    laps: 63,
    time: "1:31:33.199",
    fastestLap: "1:19.234"
  },
  {
    grandPrix: "Monaco",
    date: "25 May",
    flag: "🇲🇨",
    winner: "Charles Leclerc",
    team: "Ferrari",
    laps: 78,
    time: "1:38:17.456",
    fastestLap: "1:12.456"
  },
  {
    grandPrix: "Canada",
    date: "08 Jun",
    flag: "🇨🇦",
    winner: "Lando Norris",
    team: "McLaren",
    laps: 70,
    time: "1:45:23.678",
    fastestLap: "1:21.567"
  },
  {
    grandPrix: "Spain",
    date: "22 Jun",
    flag: "🇪🇸",
    winner: "Max Verstappen",
    team: "Red Bull Racing",
    laps: 66,
    time: "1:28:45.123",
    fastestLap: "1:18.901"
  }
];

const getTeamColor = (team: string): string => {
  const colors: Record<string, string> = {
    'McLaren': '#FF8700',
    'Red Bull Racing': '#0600EF',
    'Ferrari': '#DC0000',
    'Mercedes': '#00D2BE'
  };
  return colors[team] || '#e10600';
};

const F1ResultsPage: React.FC = () => {
  const [selectedRace, setSelectedRace] = useState<string | null>(null);

  return (
    <article className="f1-results-page" role="main" aria-labelledby="results-page-title">
      <header className="results-header">
        <h1 id="results-page-title" className="results-title">Race Results</h1>
        <p className="results-subtitle">2024 FIA Formula One World Championship</p>
      </header>

      <section aria-labelledby="results-table-heading">
        <h2 id="results-table-heading" className="visually-hidden">2024 Season Race Results</h2>
        <div className="results-table-container">
          <table className="results-table" aria-label="Formula 1 2024 season race results">
            <thead>
              <tr>
                <th scope="col">Grand Prix</th>
                <th scope="col">Date</th>
                <th scope="col">Winner</th>
                <th scope="col">Team</th>
                <th scope="col" className="text-center">Laps</th>
                <th scope="col">Time</th>
                <th scope="col">Fastest Lap</th>
              </tr>
            </thead>
            <tbody>
              {mockRaceResults.map((race, index) => (
                <tr
                  key={index}
                  className={selectedRace === race.grandPrix ? 'selected' : ''}
                  onClick={() => setSelectedRace(selectedRace === race.grandPrix ? null : race.grandPrix)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedRace === race.grandPrix}
                  aria-label={`${race.grandPrix} Grand Prix results. Winner: ${race.winner} from ${race.team}. Click to ${selectedRace === race.grandPrix ? 'deselect' : 'select'}.`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedRace(selectedRace === race.grandPrix ? null : race.grandPrix);
                    }
                  }}
                >
                  <td>
                    <div className="race-name">
                      <span className="race-flag" role="img" aria-label={`${race.grandPrix} flag`}>
                        {race.flag}
                      </span>
                      <span>{race.grandPrix}</span>
                    </div>
                  </td>
                  <td className="race-date">
                    <time dateTime={`2024-${race.date}`}>{race.date}</time>
                  </td>
                  <td>
                    <div className="winner-name">
                      <span 
                        className="team-dot" 
                        style={{ background: getTeamColor(race.team) }}
                        role="img"
                        aria-label={`${race.team} team color indicator`}
                      ></span>
                      <span>{race.winner}</span>
                    </div>
                  </td>
                  <td className="f1-team-name">{race.team}</td>
                  <td className="text-center laps">{race.laps}</td>
                  <td className="race-time">{race.time}</td>
                  <td className="fastest-lap">{race.fastestLap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="results-stats" aria-labelledby="season-stats-heading">
        <h2 id="season-stats-heading" className="visually-hidden">Season Statistics Summary</h2>
        <article className="f1-stat-card" aria-labelledby="races-completed-stat">
          <div className="stat-number" id="races-completed-stat" aria-label="10 races completed">10</div>
          <div className="stat-label">Races Completed</div>
        </article>
        <article className="f1-stat-card" aria-labelledby="different-winners-stat">
          <div className="stat-number" id="different-winners-stat" aria-label="5 different winners">5</div>
          <div className="stat-label">Different Winners</div>
        </article>
        <article className="f1-stat-card" aria-labelledby="mclaren-wins-stat">
          <div className="stat-number" id="mclaren-wins-stat" aria-label="4 McLaren wins">4</div>
          <div className="stat-label">McLaren Wins</div>
        </article>
      </aside>
    </article>
  );
};

export default F1ResultsPage;