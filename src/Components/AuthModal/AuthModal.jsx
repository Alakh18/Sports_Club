import { useEffect, useState } from "react";
import { useUser } from "../../context/usercontext";
import { enableEscapeKey } from "../../utils/ui";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";

function AuthModal({ type = "login", onClose }) {
  const { login } = useUser();
  const [admission, setAdmission] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cleanup = enableEscapeKey(onClose);
    return cleanup;
  }, [onClose]);

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!admission.trim() || !password.trim()) {
      setError("Admission number and password are required.");
      return;
    }

    if (type === "signup") {
      if (!validateEmail(email)) {
        setError("Invalid email address.");
        return;
      }

      const existing = localStorage.getItem(`user_${admission}`);
      if (existing) {
        setError("User already exists. Please login.");
        return;
      }

      const newUser = {
        admission,
        email,
        password,
        firstName: "",
        lastName: "",
        phone: "",
        image: "",
        achievements: "",
      };

      localStorage.setItem(`user_${admission}`, JSON.stringify(newUser));
      login(newUser);
      setError("");
      onClose();
      navigate("/"); // ✅ Only after successful signup
    } else {
      const stored = localStorage.getItem(`user_${admission}`);
      if (!stored) {
        setError("User not found. Please sign up.");
        return;
      }

      const user = JSON.parse(stored);
      if (user.password !== password) {
        setError("Incorrect password.");
        return;
      }

      login(user);
      setError("");
      onClose();
      navigate("/"); // ✅ Only after successful login
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{type === "login" ? "Login" : "Sign Up"}</h2>

        {/* Show error */}
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Admission Number"
            value={admission}
            onChange={(e) => setAdmission(e.target.value)}
          />
          {type === "signup" && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="cta full">
            {type === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}

export default AuthModal;
