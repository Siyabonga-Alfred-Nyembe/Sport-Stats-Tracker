import "../Styles/landingPage.css";

function LandingPage() {
  return (
    <>
    <section className="landBody">
        <header>
        <button className="hbtn">Login &rarr;</button>
        <button className="hbtn">Sign Up &rarr;</button>
      </header>
      <main>
        <section className="text">
          <p className="slogan">
            RELIABLE SERVICE
            <br />
            ACCURATE STATS
            <br />
            JUST PERFECT
          </p>
          <p className="goal">
            THE MOST <br />
            CONVENIENT PLACE <br />
            TO GET FOOTBALL STATISTICS:
          </p>
        </section>
        <section className="recentMatches">
          <h1>Some recent Matches</h1>
        </section>
      </main>
    </section>
      
    </>
  );
}

export default LandingPage;
