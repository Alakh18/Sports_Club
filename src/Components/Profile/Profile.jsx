import { useState, useEffect } from "react";
import { useUser } from "../../context/usercontext.js";
import { useNavigate } from "react-router-dom";
import "./Profile.css" 

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

  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, ...user }));
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

const { getCurrentUser } = useUser();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password && formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const token = localStorage.getItem("authToken");
    await fetch("/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    await getCurrentUser(); // Refresh user data
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      navigate("/");
    }, 2000);
  } catch (err) {
    console.error("Error: Failed to update profile", err);
    alert("Something went wrong while saving profile.");
  }
};


  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile?"
    );
    if (confirmDelete) {
      logout();
      navigate("/");
    }
  };

  return (
    <>
      <div className="profile-wrapper">
        <h2 className="profile-title">My Profile</h2>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-image-container">
            <label className="image-upload-label">
              <input
                type="file"
                accept="image/*"
                name="profileImage"
                onChange={handleChange}
                hidden
              />
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">Add Image +</div>
              )}
            </label>
          </div>

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
            Phone
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

          <button type="submit" className="cta full save-btn">
            Save Profile
          </button>
          <button
            type="button"
            className="cta full delete-btn"
            onClick={handleDelete}
          >
            Delete Profile
          </button>
        </form>

        {toastVisible && (
          <div className="profile-toast">✅ Profile saved successfully!</div>
        )}
      </div>
    </>
  );
}

export default Profile;