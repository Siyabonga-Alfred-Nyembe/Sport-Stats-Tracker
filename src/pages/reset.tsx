import React, { useState, useEffect } from "react";
import supabase from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../Styles/signUpLogin.css";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage("Password reset successful! Redirecting to dashboard...");
      
      // Get user type from profile
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", session.user.id)
          .single();

        const userType = profile?.user_type || "user";
        
        setTimeout(() => {
          if (userType === "coach") {
            navigate("/coach-dashboard");
          } else {
            navigate("/user-dashboard");
          }
        }, 2000);
      }
    } catch (err) {
      setErrorMessage("Unexpected error occurred.");
    }
  };

  return (
    <section className="siBody">
      <section id="loginsection" className="siBody">
        <form onSubmit={handleReset}>
          <h1 id="loginheader">Reset Password</h1>

          <section className="lol">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              className="input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </section>

          <section className="lol">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              className="input"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </section>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

          <section className="lol">
            <button className="loginbutton" type="submit">
              Reset Password
            </button>
          </section>
        </form>
      </section>
    </section>
  );
};

export default ResetPassword;