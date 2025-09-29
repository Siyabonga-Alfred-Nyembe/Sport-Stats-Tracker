import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { getUserRole, createUserProfile } from "../services/roleService";
import RoleSelection from "../components/RoleSelection";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [userData, setUserData] = useState<{ id: string; email: string } | null>(null);

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

          if (cameFromSignup) {
            console.log("[AuthCallback] Detected first-time signup; forcing role selection");
            setUserData({
              id: session.user.id,
              email: session.user.email || 'Unknown'
            });
            setShowRoleSelection(true);
            return;
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

  if (showRoleSelection && userData) {
    return (
      <RoleSelection
        userId={userData.id}
        userEmail={userData.email}
        onRoleSelected={handleRoleSelected}
        includeAdminOption={true}
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