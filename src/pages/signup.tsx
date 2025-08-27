import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import SHA256 from "crypto-js/sha256";
import "../Styles/Auth.css";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const hashString = (str: string) =>
    SHA256(str.trim().toLowerCase()).toString();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          emailRedirectTo: window.location.origin + "/auth-callback"
        },
      });

      if (authError) {
        setErrorMessage(authError.message);
        console.error("Signup error:", authError.message);
        return;
      }

      const hashedEmail = hashString(email);
      const hashedPassword = hashString(password);

      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([
          {
            id: authData.user?.id,
            username,
            email: hashedEmail,
            password: hashedPassword,
            user_type: userType,
          },
        ]);

      if (userError) {
        console.error("Custom users insert error:", userError.message);
      } else {
        console.log("User saved in custom table:", userData);
      }

      setErrorMessage("");
      
      if (!authData.session) {
        alert(
          "Signup successful! Please check your email to confirm before logging in."
        );
        navigate("/login");
      } else {
        if (userType === "coach") {
          navigate("/coach-dashboard", {
            state: { username, userId: authData.user?.id },
          });
        } else {
          navigate("/user-dashboard", {
            state: { username, userId: authData.user?.id },
          });
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/auth-callback" },
      });

      if (error) {
        setErrorMessage(error.message);
        console.error("Google sign-in error:", error.message);
      } else {
        console.log("Redirecting to Google login:", data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("An unexpected error occurred during Google login.");
    }
  };

  return (
    <section className="auth-body">
      <section className="auth-container">
        <form onSubmit={handleSignUp} className="auth-form">
          <h1 className="auth-header">SIGN UP</h1>

          <div className="input-group">
            <input
              id="username"
              type="text"
              className="input-field"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="username" className="input-label">Username</label>
          </div>

          <div className="input-group">
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder=" "
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email" className="input-label">Email</label>
          </div>

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

          <div className="input-group">
            <input
              id="confirmPassword"
              type="password"
              className="input-field"
              placeholder=" "
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="auth-button" type="submit">SIGN UP</button>

          <p className="switch-link">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </form>
      </section>
    </section>
  );
};

export default Signup;















































