import React, { useState } from "react";

const mockStandings: Record<
  string,
  {
    drivers: { name: string; team: string; points: number }[];
    constructors: { name: string; points: number }[];
  }
> = {
  "2024": {
    drivers: [
      { name: "Max Verstappen", team: "Red Bull", points: 575 },
      { name: "Lando Norris", team: "McLaren", points: 398 },
      { name: "Charles Leclerc", team: "Ferrari", points: 377 },
    ],
    constructors: [
      { name: "Red Bull Racing", points: 782 },
      { name: "Ferrari", points: 654 },
      { name: "McLaren", points: 601 },
    ],
  },
};


const F1StatsPage: React.FC = () => {
  const [year, setYear] = useState("2024");

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
        <option>2024</option>
        <option>2023</option>
        <option>2022</option>
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
            {mockStandings[year]?.drivers.map((d, i) => (
              <tr key={d.name}>
                <td>{i + 1}</td>
                <td>{d.name}</td>
                <td>{d.team}</td>
                <td>{d.points}</td>
              </tr>
            ))}
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
            </tr>
          </thead>
          <tbody>
            {mockStandings[year]?.constructors.map((t, i) => (
              <tr key={t.name}>
                <td>{i + 1}</td>
                <td>{t.name}</td>
                <td>{t.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default F1StatsPage;
