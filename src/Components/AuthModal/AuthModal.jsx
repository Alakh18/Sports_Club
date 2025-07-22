import React, { useState } from "react";
import { useUser } from "../../context/usercontext";
import "./AuthModal.css";

function AuthModal({ type, onClose }) {
  const { login, signup } = useUser();

  const [admission, setAdmission] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!admission.trim() || !password.trim()) {
      setError("Admission number and password are required.");
      return;
    }

    const result = await login(admission, password);
    if (!result.success) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!admission.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const result = await signup(admission, email, password);
    if (!result.success) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="auth-modal">
        <button className="close-btn" onClick={() => onClose()}>
          ×
        </button>
        <h2>{type === "login" ? "Login" : "Sign Up"}</h2>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={type === "login" ? handleLogin : handleSignup}>
          <div className="form-group">
            <label>Admission Number</label>
            <input
              type="text"
              value={admission}
              onChange={(e) => setAdmission(e.target.value)}
              placeholder="e.g. U24AB123"
            />
          </div>

          {type === "signup" && (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@svnit.ac.in"
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-button">
            {type === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="auth-switch">
          {type === "login" ? (
            <p>
              Don’t have an account?{" "}
              <button onClick={() => onClose("signup")}>Sign up</button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={() => onClose("login")}>Login</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
