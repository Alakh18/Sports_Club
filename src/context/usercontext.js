import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

function UserProvider(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
  };

  return React.createElement(
    UserContext.Provider,
    { value: { user, login, logout } },
    props.children
  );
}

function useUser() {
  return useContext(UserContext);
}

export { UserProvider, useUser };
