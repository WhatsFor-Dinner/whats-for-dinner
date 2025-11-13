import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Create the Auth Context
const AuthContext = createContext();

// Provider component to wrap your app
export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Check if user token exists in localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save token/user when they change
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [token, user]);

  // Function to simulate login (will connect to backend later)
  const login = (email, fakeToken = "demo_token_123") => {
    setUser({ email });
    setToken(fakeToken);
    navigate("/profilepage");
  };

  // Function to log out
  const logout = () => {
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access
export function useAuth() {
  return useContext(AuthContext);
}

// Optional: wrapper to protect routes
export function RequireAuth({ children }) {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  return token ? children : null;
}
