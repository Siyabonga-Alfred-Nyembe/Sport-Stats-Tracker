import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import LandingPage from "./pages/landingPage";
import Land from "./pages/land";
import ForgotPassword from "./pages/forgot";
import ResetPassword from "./pages/reset";
const App: React.FC = () => {
  return (
    <Router>
      <section className="App">
        <Routes>
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/" element={<LandingPage />} /> {/* home page */}
          <Route path="/land" element={<Land />} /> {/* personalized page */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<ForgotPassword />} />
        </Routes>
      </section>
    </Router>
  );
};

export default App;
