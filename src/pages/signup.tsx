import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import SHA256 from "crypto-js/sha256";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
        options: { emailRedirectTo: window.location.origin + "/login" },
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
          },
        ]);

      if (userError) {
        console.error("Custom users insert error:", userError.message);
      } else {
        console.log("User saved in custom table:", userData);
      }

      setErrorMessage("");
      alert(
        "Signup successful! Please check your email to confirm before logging in."
      );
      navigate("/login");
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/land" },
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
    <section className="siBody">
      <section id="loginsection">
        <form onSubmit={handleSignUp}>
          <h1 id="loginheader">SIGNUP</h1>

          <div className="lol">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="lol">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              className="input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="lol">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              className="input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="lol">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              className="input"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <div className="lol">
            <button className="loginbutton" type="submit">
              SIGN UP
            </button>
          </div>

          <section className="divider">OR</section>

          <button className="google" type="button" onClick={handleGoogleSignIn}>
            <img
              src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
              width="20"
            />
            Continue with Google
          </button>

          <p>
            Already have an account? <Link to="/login">log in</Link>
          </p>
        </form>
      </section>
    </section>
  );
};

export default Signup;