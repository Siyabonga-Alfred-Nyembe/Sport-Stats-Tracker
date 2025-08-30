import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { uploadAvatar, upsertUserProfile, fetchUserProfile } from "../services/profileService";
import InlineAlert from "./components/InlineAlert";
import "../Styles/profileSettings.css";

interface ProfileData {
  name: string;
  bio: string;
  profilePicture: string | null;
}

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    bio: "",
    profilePicture: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const data = await fetchUserProfile(user.id);
      if (data) {
        setProfile({
          name: data.display_name || "",
          bio: data.bio || "",
          profilePicture: data.avatar_url || null
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setErrorMsg("We could not load your profile. Please try again later.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        await upsertUserProfile({
          id: user.id,
          display_name: profile.name,
          bio: profile.bio,
          avatar_url: profile.profilePicture || null,
        });
        setMessage("Profile saved successfully!");
        setErrorMsg(null);
      } catch (err: any) {
        setErrorMsg("We could not save your profile. Please try again.");
      }
    } catch (error) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const publicUrl = await uploadAvatar(user.id, file);
      if (!publicUrl) {
        setErrorMsg("We could not upload your picture. Please try again later.");
        return;
      }
      setProfile({ ...profile, profilePicture: publicUrl });
    } catch (error) {
      setErrorMsg("Error uploading image. Please try again.");
    }
  };

  return (
    <section className="profile-settings">
      <header className="profile-header">
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Back
        </button>
        <h1>Profile Settings</h1>
      </header>

      <form onSubmit={handleSave} className="profile-form">
        <InlineAlert message={errorMsg} onClose={() => setErrorMsg(null)} />
        <section className="profile-picture-section">
          <section className="profile-picture">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt="Profile" />
            ) : (
              <section className="profile-placeholder">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </section>
            )}
          </section>
          <input
            type="file"
            id="profile-picture"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="profile-picture" className="upload-button">
            Change Picture
          </label>
        </section>

        <section className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Enter your name"
          />
        </section>

        <section className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Tell us about yourself"
            rows={4}
          />
        </section>

        {message && <section className="message">{message}</section>}

        <button type="submit" disabled={loading} className="save-button">
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </section>
  );
};

export default ProfileSettings;