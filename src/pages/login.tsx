import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import SHA256 from "crypto-js/sha256";
import "../Styles/signUpLogin.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Hash function
  const hashString = (str: string) => SHA256(str.trim()).toString();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
 
      const { data: userData, error } = await supabase
        .from("users")
        .select("id, username, password")
        .eq("username", username)
        .single();

      if (error || !userData) {
        setErrorMessage("Username not found.");
        return;
      }

 
      const hashedPassword = hashString(password);
      if (hashedPassword !== userData.password) {
        setErrorMessage("Invalid password.");
        return;
      }


      navigate("/land", {
        state: { username: userData.username, isGoogleUser: false },
      });
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const {error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/land" },
      });

      if (error) {
        setErrorMessage(error.message);
        console.error("Google login error:", error.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Unexpected error during Google login.");
    }
  };

  return (
    <section className="siBody">
      <section id="loginsection" className="siBody">
        <form onSubmit={handleLogin}>
          <h1 id="loginheader">LOGIN</h1>

          <div className="lol">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              className="input"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
            />
          </div>

          <div className="lol">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter Password"
              className="input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <div className="lol">
            <button className="loginbutton" type="submit">
              LOGIN
            </button>
          </div>

          <section className="divider">OR</section>

          <button
            className="google"
            type="button"
            onClick={handleGoogleSignIn}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px", 
              padding: "8px 16px", 
            }}
          >
            <img
              src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
              style={{ height: "20px", width: "20px", objectFit: "contain" }}
              alt="Google logo"
            />
            Continue with Google
          </button>

          <p>
            Are you new? <Link to="/signup">Sign up</Link>
          </p>
          <p>
            Forgot password? <Link to="/forgot">Reset Password</Link>
          </p>
        </form>
      </section>
    </section>
  );
};

export default Login;