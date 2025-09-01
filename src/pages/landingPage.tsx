import "../Styles/landingPage.css";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate(); 

  return (
    <>
      <section className="landBody">
        <header>
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
         
        </main>
      </section>
    </>
  );
}

export default LandingPage;