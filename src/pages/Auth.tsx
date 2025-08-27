// src/components/Auth/AuthPage.tsx

import React, { useState, useRef, useLayoutEffect } from "react"; // Import useRef and useLayoutEffect
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import SHA256 from "crypto-js/sha256";
import "../Styles/Auth.css";

const AuthPage: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  // --- Refs to measure the height of the front and back cards ---
  const flipperRef = useRef<HTMLDivElement>(null);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  // --- Effect to dynamically set the container height ---
  useLayoutEffect(() => {
    if (!flipperRef.current || !frontCardRef.current || !backCardRef.current) return;

    // Determine the height of the currently visible card
    const newHeight = isFlipped 
      ? backCardRef.current.offsetHeight 
      : frontCardRef.current.offsetHeight;
      
    // Apply the new height to the flipper container for a smooth transition
    flipperRef.current.style.height = `${newHeight}px`;

  }, [isFlipped]); // Re-run this logic every time the card flips

  // --- All your existing state and handler functions remain exactly the same ---
  // [loginEmail, setLoginEmail]
  // [signupUsername, setSignupUsername]
  // handleLogin()
  // handleSignUp()
  // etc...
  // --- (I'm omitting them here for brevity, but you should keep them as they are) ---
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupUserType, setSignupUserType] = useState("user");
  const [signupErrorMessage, setSignupErrorMessage] = useState("");
  const hashString = (str: string) => SHA256(str.trim().toLowerCase()).toString();
  const handleLogin = async (e: React.FormEvent) => { /* Your logic */ };
  const handleSignUp = async (e: React.FormEvent) => { /* Your logic */ };
  const handleGoogleSignIn = async () => { /* Your logic */ };

  return (
    <main className="auth-body">
      <div className="auth-flipper">
        {/* Assign the ref to the flipper-inner element */}
        <div ref={flipperRef} className={`flipper-inner ${isFlipped ? 'flipped' : ''}`}>
          
          {/* LOGIN CARD (FRONT): Assign the ref to the card-face */}
          <div ref={frontCardRef} className="card-face card-front">
            <div className="auth-container">
              {/* Your entire login form JSX goes here, unchanged */}
              <form onSubmit={handleLogin} className="auth-form">
                <h1 className="auth-header">LOGIN</h1>
                <div className="input-group">
                  <input id="login-email" type="email" className="input-field" placeholder=" " required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                  <label htmlFor="login-email" className="input-label">Email</label>
                </div>
                <div className="input-group">
                  <input id="login-password" type="password" className="input-field" placeholder=" " required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                  <label htmlFor="login-password" className="input-label">Password</label>
                </div>
                {loginErrorMessage && !isFlipped && <p className="error-message">{loginErrorMessage}</p>}
                <button className="auth-button" type="submit">LOGIN</button>
                <div className="divider">OR</div>
                <button className="google-button" type="button" onClick={handleGoogleSignIn}>
                  <img src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000" alt="Google logo" />
                  Continue with Google
                </button>
                <p className="switch-link">
                  Are you new? <span onClick={() => setIsFlipped(true)}>Sign Up</span>
                </p>
              </form>
            </div>
          </div>

          {/* SIGNUP CARD (BACK): Assign the ref to the card-face */}
          <div ref={backCardRef} className="card-face card-back">
            <div className="auth-container">
              {/* Your entire sign-up form JSX goes here, unchanged */}
               <form onSubmit={handleSignUp} className="auth-form">
                <h1 className="auth-header">SIGN UP</h1>
                <div className="input-group">
                  <input id="signup-username" type="text" className="input-field" placeholder=" " required value={signupUsername} onChange={e => setSignupUsername(e.target.value)} />
                  <label htmlFor="signup-username" className="input-label">Username</label>
                </div>
                <div className="input-group">
                  <input id="signup-email" type="email" className="input-field" placeholder=" " required value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
                  <label htmlFor="signup-email" className="input-label">Email</label>
                </div>
                 <div className="input-group">
                  <input id="signup-password" type="password" className="input-field" placeholder=" " required value={signupPassword} onChange={e => setSignupPassword(e.target.value)} />
                  <label htmlFor="signup-password" className="input-label">Password</label>
                </div>
                <div className="input-group">
                  <input id="signup-confirm" type="password" className="input-field" placeholder=" " required value={signupConfirmPassword} onChange={e => setSignupConfirmPassword(e.target.value)} />
                  <label htmlFor="signup-confirm" className="input-label">Confirm Password</label>
                </div>
                <div className="form-group-static">
                  <label htmlFor="userType">I am a:</label>
                  <select id="userType" className="select-field" value={signupUserType} onChange={(e) => setSignupUserType(e.target.value)} required>
                      <option value="user">Fan/User</option>
                      <option value="coach">Coach</option>
                  </select>
                </div>
                {signupErrorMessage && isFlipped && <p className="error-message">{signupErrorMessage}</p>}
                <button className="auth-button" type="submit">SIGN UP</button>
                <p className="switch-link">
                  Already have an account? <span onClick={() => setIsFlipped(false)}>Log In</span>
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default AuthPage;