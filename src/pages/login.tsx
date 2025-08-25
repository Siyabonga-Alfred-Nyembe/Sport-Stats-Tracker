import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import "../Styles/signUpLogin.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        // Check user type from metadata or database
        const { data: profileData } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", data.user.id)
          .single();

        const userType = profileData?.user_type || "user";
        
        if (userType === "coach") {
          navigate("/coach-dashboard", {
            state: { username: data.user.email, userId: data.user.id },
          });
        } else {
          navigate("/user-dashboard", {
            state: { username: data.user.email, userId: data.user.id },
          });
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { 
          redirectTo: window.location.origin + "/auth-callback",
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (err) {
      setErrorMessage("Unexpected error during Google login.");
    }
  };

  return (
    <section className="siBody">
      <section id="loginsection" className="siBody">
        <form onSubmit={handleLogin}>
          <h1 id="loginheader">LOGIN</h1>

          <section className="lol">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </section>

          <section className="lol">
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
          </section>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <section className="lol">
            <button className="loginbutton" type="submit">
              LOGIN
            </button>
          </section>

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