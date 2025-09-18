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
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        navigate("/login");
        return;
      }

      if (session?.user) {
        try {
          // Check if user exists in our users table
          const userRole = await getUserRole(session.user.id);
          
          if (!userRole) {
            // New user - show role selection
            setUserData({
              id: session.user.id,
              email: session.user.email || 'Unknown'
            });
            setShowRoleSelection(true);
            return;
          }

          // Existing user - redirect based on role
          if (userRole.role === "Coach") {
            navigate("/coach-dashboard", {
              state: { 
                username: session.user.email, 
                userId: session.user.id,
                isGoogleUser: true 
              },
            });
          } else {
            navigate("/user-dashboard", {
              state: { 
                username: session.user.email, 
                userId: session.user.id,
                isGoogleUser: true 
              },
            });
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const handleRoleSelected = async (role: 'Fan' | 'Coach') => {
    if (!userData) return;

    try {
      // Create user profile with selected role
      const success = await createUserProfile(userData.id, userData.email, role);
      
      if (success) {
        if (role === 'Coach') {
          navigate('/team-setup');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        console.error('Failed to create user profile');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      navigate('/login');
    }
  };

  if (showRoleSelection && userData) {
    return (
      <RoleSelection
        userId={userData.id}
        userEmail={userData.email}
        onRoleSelected={handleRoleSelected}
      />
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: '#666'
    }}>
      Loading...
    </div>
  );
};

export default AuthCallback;