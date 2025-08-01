import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get("https://sports-club.onrender.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("loggedInUser");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (admission, password) => {
    try {
      const res = await axios.post(
        "https://sports-club.onrender.com/api/auth/login",
        { admission, password },
        { withCredentials: true }
      );

      const { user, token } = res.data;

      setUser(user);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      localStorage.setItem("authToken", token);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  const signup = async (admission, email, password) => {
    try {
      const res = await axios.post(
        "https://sports-club.onrender.com/api/auth/signup",
        { admission, email, password },
        { withCredentials: true }
      );

      const { user, token } = res.data;

      setUser(user);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      localStorage.setItem("authToken", token);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Signup failed",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post("https://sports-club.onrender.com/api/auth/logout");
      setUser(null);
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("authToken");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("https://sports-club.onrender.com/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  return React.createElement(
    UserContext.Provider,
    {
      value: { user, login, signup, logout, getCurrentUser, loading, setUser },
    },
    children
  );
}

function useUser() {
  return useContext(UserContext);
}

export { UserProvider, useUser };
