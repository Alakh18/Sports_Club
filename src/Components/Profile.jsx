import { useState, useEffect } from "react";
import { useUser } from "../context/usercontext.js";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, login, logout } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
    achievements: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        ...user,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const updatedUser = { ...user, ...formData };

    localStorage.setItem(`user_${user.admission}`, JSON.stringify(updatedUser));

    login(updatedUser);

    alert("Profile updated successfully!");
    navigate("/");
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your profile?"
    );
    if (confirmed) {
      logout();
      navigate("/");
    }
  };

  return (
    <section className="profile-section">
      <h2 className="section-heading" style={{ textAlign: "center" }}>
        My Profile
      </h2>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Profile Picture
          <input
            type="file"
            accept="image/*"
            name="profileImage"
            onChange={handleChange}
          />
          {formData.profileImage && (
            <img
              src={formData.profileImage}
              alt="Profile Preview"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                marginTop: "10px",
              }}
            />
          )}
        </label>

        <label>
          First Name
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>

        <label>
          Last Name
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          New Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </label>

        <label>
          Achievements
          <textarea
            name="achievements"
            rows="4"
            value={formData.achievements}
            onChange={handleChange}
            placeholder="List your achievements..."
          />
        </label>

        <button type="submit" className="cta full">
          Update Profile
        </button>
        <button
          type="button"
          className="cta full"
          style={{ background: "#d72638", color: "white" }}
          onClick={handleDelete}
        >
          Delete Profile
        </button>
      </form>
    </section>
  );
}

export default Profile;
