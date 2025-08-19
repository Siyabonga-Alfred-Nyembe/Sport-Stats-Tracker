import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import supabase from "../../supabaseClient";

const googleColors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

const Land: React.FC = () => {
  const location = useLocation();
  const [username, setUsername] = useState("User");
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    
    if (location.state?.username) {
      setUsername(location.state.username);
      setIsGoogleUser(location.state.isGoogleUser || false);
      return;
    }

   
    const fetchGoogleUser = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) return;

      if (user.app_metadata?.provider === "google") {
        setIsGoogleUser(true);
        const displayName =
          user.user_metadata?.full_name || user.user_metadata?.name || "User";
        setUsername(displayName);
      }
    };

    fetchGoogleUser();
  }, [location.state]);

  return (
    <div
      style={{
        backgroundColor: "black",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "4rem",
        fontWeight: "bold",
      }}
    >
      {username.split("").map((char, idx) => (
        <span
          key={idx}
          style={{
            color: googleColors[idx % googleColors.length], // always use Google colors
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default Land;
