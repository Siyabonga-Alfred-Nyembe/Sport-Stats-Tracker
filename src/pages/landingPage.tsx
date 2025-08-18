import "../Styles/landingPage.css";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

function LandingPage() {
  const navigate = useNavigate(); // Get the navigate function

  return (
    <>
      <section className="landBody">
        <header>
          {/* Use onClick handlers to trigger navigation */}
          <button className="hbtn" onClick={() => navigate('/login')}>
            Login &rarr;
          </button>
          <button className="hbtn" onClick={() => navigate('/signup')}>
            Sign Up &rarr;
          </button>
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