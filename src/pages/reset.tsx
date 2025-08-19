import React, { useState } from "react";
import supabase from "../../supabaseClient";
import SHA256 from "crypto-js/sha256";
import { useNavigate } from "react-router-dom";
import "../Styles/signUpLogin.css";

const ResetPassword: React.FC = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {

      const { data: userData, error } = await supabase
        .from("users")
        .select("id, username")
        .eq("username", username)
        .single();

      if (error || !userData) {
        setErrorMessage("Username not found.");
        return;
      }


      const hashedPassword = SHA256(newPassword).toString();


      const { error: updateError } = await supabase
        .from("users")
        .update({ password: hashedPassword })
        .eq("id", userData.id);

      if (updateError) {
        setErrorMessage("Failed to reset password. Try again.");
        return;
      }

      setSuccessMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      setErrorMessage("Unexpected error occurred.");
    }
  };

  return (
    <section className="siBody">
      <section id="loginsection" className="siBody">
        <form onSubmit={handleReset}>
          <h1 id="loginheader">Reset Password</h1>

          <div className="lol">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="input"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
            />
          </div>

          <div className="lol">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              className="input"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="lol">
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
          </div>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

          <div className="lol">
            <button className="loginbutton" type="submit">
              Reset Password
            </button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default ResetPassword;