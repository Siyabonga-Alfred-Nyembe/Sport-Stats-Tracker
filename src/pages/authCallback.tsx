import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { getUserRole, createUserProfile } from "../services/roleService";
import RoleSelection from "../components/RoleSelection";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [userData, setUserData] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AuthCallback] onAuthStateChange", { event, hasSession: !!session });

      if (!session?.user) {
        console.warn("[AuthCallback] No session found; redirecting to /login");
        navigate("/login");
        return;
      }

      try {
        console.log("[AuthCallback] Session user detected", {
          userId: session.user.id,
          email: session.user.email,
        });

        // detect if user came from signup
        const searchParams = new URLSearchParams(window.location.search);
        let cameFromSignup = searchParams.get("from") === "signup";
        if (!cameFromSignup) {
          try {
            cameFromSignup = localStorage.getItem("cameFromSignup") === "1";
            if (cameFromSignup) localStorage.removeItem("cameFromSignup");
          } catch {}
        }

        if (cameFromSignup) {
          console.log("[AuthCallback] First-time signup → forcing role selection");
          setUserData({
            id: session.user.id,
            email: session.user.email || "Unknown",
          });
          setShowRoleSelection(true);
          return;
        }

        // check role from database
        const userRole = await getUserRole(session.user.id);
        console.log("[AuthCallback] getUserRole resolved", userRole);

        if (!userRole) {
          console.log("[AuthCallback] No role found; prompting role selection");
          setUserData({
            id: session.user.id,
            email: session.user.email || "Unknown",
          });
          setShowRoleSelection(true);
          return;
        }

        // route by role
        if (userRole.role === "Coach") {
          console.log("[AuthCallback] Navigating to coach dashboard");
          navigate("/coach-dashboard", {
            state: { username: session.user.email, userId: session.user.id, isGoogleUser: true },
          });
        } else if (userRole.role === "Admin") {
          console.log("[AuthCallback] Navigating to admin dashboard");
          navigate("/admin-dashboard", {
            state: { username: session.user.email, userId: session.user.id, isGoogleUser: true },
          });
        } else {
          console.log("[AuthCallback] Navigating to user dashboard");
          navigate("/user-dashboard", {
            state: { username: session.user.email, userId: session.user.id, isGoogleUser: true },
          });
        }
      } catch (error) {
        console.error("[AuthCallback] Error during role check:", error);
        navigate("/login");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Handle role selection
  const handleRoleSelected = async (role: string) => {
    if (!userData) return;
    try {
      console.log("[AuthCallback] Role selected; creating user profile", {
        role,
        userId: userData.id,
        email: userData.email,
      });

      const success = await createUserProfile(userData.id, userData.email, role);
      if (success) {
        if (role === "Coach") {
          console.log("[AuthCallback] Navigating to team setup");
          navigate("/team-setup");
        } else if (role === "Admin") {
          console.log("[AuthCallback] Navigating to admin dashboard");
          navigate("/admin-dashboard");
        } else {
          console.log("[AuthCallback] Navigating to user dashboard");
          navigate("/user-dashboard");
        }
      } else {
        console.error("[AuthCallback] Failed to create user profile");
        navigate("/login");
      }
    } catch (error) {
      console.error("[AuthCallback] Error creating user profile:", error);
      navigate("/login");
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
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.2rem",
        color: "#666",
      }}
    >
      Finishing sign in...
    </section>
  );
};

export default AuthCallback;

