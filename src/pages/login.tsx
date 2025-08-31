import React, { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../supabaseClient";
import "../Styles/signUpLogin.css";

const Login: React.FC = () => {
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
          <h1 className="auth-header">LOGIN</h1>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button
            className="google-button"
            type="button"
            onClick={handleGoogleSignIn}
          >
            <img
              src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
              alt="Google logo"
            />
            Continue with Google
          </button>

          <div className="auth-links">
            <span>
              Are you new? <Link to="/signup">Sign up</Link>
            </span>
          </div>
        </form>
      </section>
    </section>
  );
};

export default Login;
