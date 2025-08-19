import React, { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../supabaseClient";
import "../Styles/signUpLogin.css";
import ResetPassword from "./reset"; // adjust path to where you put it

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset", // go straight to reser
      });

      if (error) {
        setErrorMessage(error.message);
        console.error("Password reset error:", error.message);
      } else {
        setMessage(
          "If this email exists, a password reset link has been sent. Check your inbox."
        );
        console.log("Password reset initiated:", data);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Unexpected error occurred during password reset.");
    }
  };

  return (
    <section className="siBody">
      <section id="loginsection" className="siBody">
        <form onSubmit={handleResetPassword}>
          <h1 id="loginheader">FORGOT PASSWORD</h1>

          <div className="lol">
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
          </div>

          {message && <p style={{ color: "green" }}>{message}</p>}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <div className="lol">
            <button className="loginbutton" type="submit">
              RESET PASSWORD
            </button>
          </div>

          <p>
            Remembered your password? <Link to="/login">Log in</Link>
          </p>
        </form>
      </section>
    </section>
  );
};

export default ForgotPassword;
