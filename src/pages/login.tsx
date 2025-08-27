import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import "../Styles/signUpLogin.css"; // Import the unified stylesheet

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", data.user.id)
          .single();

        const dbUserType = profileData?.user_type || "user";

        if (dbUserType === "coach") {
          navigate("/coach-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleGoogleSignIn = async () => {
    // Your Google Sign-In logic here
  };

  return (
    <section className="auth-body">
      <section className="auth-container">
        <form onSubmit={handleLogin} className="auth-form">
          <h1 className="auth-header">LOGIN</h1>

          <div className="user-type-toggle">
            <button
              type="button"
              className={`toggle-btn ${userType === 'user' ? 'active' : ''}`}
              onClick={() => setUserType('user')}
            >
              User
            </button>
            <button
              type="button"
              className={`toggle-btn ${userType === 'coach' ? 'active' : ''}`}
              onClick={() => setUserType('coach')}
            >
              Coach
            </button>
          </div>

          <div className="input-group">
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder=" "
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
            <label htmlFor="email" className="input-label">Email</label>
          </div>

          <div className="input-group">
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder=" "
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password" className="input-label">Password</label>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="auth-button" type="submit">LOGIN</button>

          <div className="divider">OR</div>

          <button className="google-button" type="button" onClick={handleGoogleSignIn}>
            <img src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000" alt="Google logo" />
            Continue with Google
          </button>
          
          {/* Links are now grouped together */}
          <div className="auth-links">
            <span>Are you new? <Link to="/signup">Sign up</Link></span>
            <Link to="/forgot">Forgot password?</Link>
          </div>

        </form>
      </section>
    </section>
  );
};

export default Login;