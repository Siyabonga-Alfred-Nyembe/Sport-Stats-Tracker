import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { getUserRole, createUserProfile, checkUserExists, isAdminEligible } from "../services/roleService";
import RoleSelection from "../components/RoleSelection";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [userData, setUserData] = useState<{ id: string; email: string } | null>(null);
  const [existingAccountMessage, setExistingAccountMessage] = useState<string | null>(null);
  const [includeAdminOption, setIncludeAdminOption] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Supabase client is configured with detectSessionInUrl: true, so it
      // will exchange the code automatically when the page loads.
      console.log("[AuthCallback] Handling auth callback", {
        location: window.location.href,
        origin: window.location.origin
      });

      // Detect OAuth error returned in the callback URL and if we came from signup
      const searchParams = new URLSearchParams(window.location.search);
      const oauthError = searchParams.get('error');
      const oauthErrorDescription = searchParams.get('error_description');
      const fromParam = searchParams.get('from');
      if (oauthError) {
        console.error("[AuthCallback] OAuth provider returned error:", {
          error: oauthError,
          description: oauthErrorDescription
        });
        // Optionally surface to user; keeping console-only to avoid extra UI right now
        navigate("/login");
        return;
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("[AuthCallback] getSession resolved", { hasSession: !!session, error });
      
      if (error) {
        console.error("[AuthCallback] Error getting session:", error);
        navigate("/login");
        return;
      }

      if (session?.user) {
        try {
          console.log("[AuthCallback] Session user detected", {
            userId: session.user.id,
            email: session.user.email
          });

          // If we came directly from signup (query param or localStorage), force role selection once
          let cameFromSignup = fromParam === 'signup';
          if (!cameFromSignup) {
            try {
              cameFromSignup = localStorage.getItem('cameFromSignup') === '1';
              if (cameFromSignup) localStorage.removeItem('cameFromSignup');
            } catch {}
          }

          // Check if user exists in our database
          const userCheck = await checkUserExists(session.user.email || '');
          console.log("[AuthCallback] User check result:", userCheck);
          
          if (cameFromSignup) {
            console.log("[AuthCallback] Detected first-time signup; checking if user already exists");
            console.log("[AuthCallback] cameFromSignup flag:", cameFromSignup);
            console.log("[AuthCallback] URL search params:", window.location.search);
            
            if (userCheck.exists && userCheck.role) {
              console.log("[AuthCallback] User already exists with role:", userCheck.role);
              setExistingAccountMessage(
                `You already have an account as a ${userCheck.role}. Please sign in instead.`
              );
              // Redirect to login after 3 seconds
              setTimeout(() => {
                navigate('/login');
              }, 3000);
              return;
            }
            
            // If user exists but has no role, treat as incomplete signup and proceed with role selection
            if (userCheck.exists && !userCheck.role) {
              console.log("[AuthCallback] User exists but has no role; checking admin eligibility");
              const adminEligible = await isAdminEligible(session.user.email || '');
              console.log("[AuthCallback] Admin eligible:", adminEligible);
              
              setUserData({
                id: session.user.id,
                email: session.user.email || 'Unknown'
              });
              setIncludeAdminOption(adminEligible);
              setShowRoleSelection(true);
              return;
            }
            
            console.log("[AuthCallback] No existing account found; checking admin eligibility");
            const adminEligible = await isAdminEligible(session.user.email || '');
            console.log("[AuthCallback] Admin eligible:", adminEligible);
            
            setUserData({
              id: session.user.id,
              email: session.user.email || 'Unknown'
            });
            setIncludeAdminOption(adminEligible);
            setShowRoleSelection(true);
            return; // IMPORTANT: Return here to prevent further execution
          } else {
            // This is a sign-in attempt, check if user exists
            console.log("[AuthCallback] Detected sign-in attempt; checking if user exists");
            
            if (!userCheck.exists) {
              console.log("[AuthCallback] User does not exist; showing no account message");
              setExistingAccountMessage(
                "You don't have an account yet. Please sign up first before you can sign in."
              );
              // Redirect to signup after 3 seconds
              setTimeout(() => {
                navigate('/signup');
              }, 3000);
              return;
            }
          }

          const userRole = await getUserRole(session.user.id);
          console.log("[AuthCallback] getUserRole resolved", userRole);
          
          if (!userRole) {
            console.log("[AuthCallback] No role found; prompting role selection");
            setUserData({
              id: session.user.id,
              email: session.user.email || 'Unknown'
            });
            setShowRoleSelection(true);
            return;
          }

          if (userRole.role === "Coach") {
            console.log("[AuthCallback] Navigating to coach dashboard");
            navigate("/coach-dashboard", {
              state: { 
                username: session.user.email, 
                userId: session.user.id,
                isGoogleUser: true 
              },
            });
          } else if (userRole.role === "Admin") {
            console.log("[AuthCallback] Navigating to admin dashboard");
            navigate("/admin-dashboard", {
              state: { 
                username: session.user.email, 
                userId: session.user.id,
                isGoogleUser: true 
              },
            });
          } else {
            console.log("[AuthCallback] Navigating to user dashboard");
            navigate("/user-dashboard", {
              state: { 
                username: session.user.email, 
                userId: session.user.id,
                isGoogleUser: true 
              },
            });
          }
        } catch (error) {
          console.error("[AuthCallback] Error checking user role:", error);
          navigate("/login");
        }
      } else {
        console.warn("[AuthCallback] No session found; redirecting to /login");
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const handleRoleSelected = async (role: 'Fan' | 'Coach' | 'Admin') => {
    if (!userData) return;

    try {
      console.log("[AuthCallback] Role selected; creating user profile", {
        role,
        userId: userData.id,
        email: userData.email
      });
      const success = await createUserProfile(userData.id, userData.email, role);
      console.log("[AuthCallback] createUserProfile result", { success });
      
      if (success) {
        if (role === 'Coach') {
          console.log("[AuthCallback] Navigating to team setup");
          navigate('/team-setup');
        } else if (role === 'Admin') {
          console.log("[AuthCallback] Navigating to admin dashboard after profile creation");
          navigate('/admin-dashboard');
        } else {
          console.log("[AuthCallback] Navigating to user dashboard after profile creation");
          navigate('/user-dashboard');
        }
      } else {
        console.error('[AuthCallback] Failed to create user profile');
        navigate('/login');
      }
    } catch (error) {
      console.error('[AuthCallback] Error creating user profile:', error);
      navigate('/login');
    }
  };

  if (existingAccountMessage) {
    const isNoAccountError = existingAccountMessage.includes("don't have an account yet");
    const redirectPath = isNoAccountError ? '/signup' : '/login';
    const redirectText = isNoAccountError ? 'sign up page' : 'sign in page';
    const buttonText = isNoAccountError ? 'Go to Sign Up Now' : 'Go to Sign In Now';
    const title = isNoAccountError ? 'No Account Found' : 'Account Already Exists';
    const backgroundColor = isNoAccountError ? '#f8d7da' : '#fff3cd';
    const borderColor = isNoAccountError ? '#f5c6cb' : '#ffeaa7';
    const titleColor = isNoAccountError ? '#721c24' : '#856404';

    return (
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#333',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '8px',
          padding: '2rem',
          maxWidth: '500px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: titleColor, marginBottom: '1rem' }}>{title}</h2>
          <p style={{ marginBottom: '1.5rem' }}>{existingAccountMessage}</p>
          <p style={{ fontSize: '1rem', color: '#666' }}>
            Redirecting to {redirectText} in a few seconds...
          </p>
          <button 
            onClick={() => navigate(redirectPath)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            {buttonText}
          </button>
        </div>
      </section>
    );
  }

  if (showRoleSelection && userData) {
    return (
      <RoleSelection
        userId={userData.id}
        userEmail={userData.email}
        onRoleSelected={handleRoleSelected}
        includeAdminOption={includeAdminOption}
      />
    );
  }

  return (
    <section style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: '#666'
    }}>
      Loading...
    </section>
  );
};

export default AuthCallback;
