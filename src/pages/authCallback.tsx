
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        navigate("/login");
        return;
      }

      if (session?.user) {
        // Check if this is a new user (just signed up)
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", session.user.id)
          .single();

        const userType = profile?.user_type || "user";
        
        if (userType === "coach") {
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
      } else {
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;