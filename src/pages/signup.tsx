import React, { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../supabaseClient";
import "../Styles/Auth.css";

const Signup: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth-callback",
        },
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
        <form onSubmit={(e) => e.preventDefault()} className="auth-form">
          <h1 className="auth-header">SIGN UP</h1>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button
            className="auth-button"
            type="button"
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </button>

          <p className="switch-link">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </form>
      </section>
    </section>
  );
};

export default Signup;
