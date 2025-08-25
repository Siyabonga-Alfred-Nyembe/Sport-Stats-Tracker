import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
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

      const { data, error } = await supabase
        .from("profiles")
        .select("name, bio, profile_picture")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfile({
          name: data.name || "",
          bio: data.bio || "",
          profilePicture: data.profile_picture
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
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

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          name: profile.name,
          bio: profile.bio,
          profile_picture: profile.profilePicture,
          updated_at: new Date().toISOString()
        });

      if (error) {
        setMessage("Error saving profile: " + error.message);
      } else {
        setMessage("Profile saved successfully!");
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
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

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file);

      if (uploadError) {
        setMessage("Error uploading image: " + uploadError.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      setProfile({ ...profile, profilePicture: publicUrl });
    } catch (error) {
      setMessage("Error uploading image");
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