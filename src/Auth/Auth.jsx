import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Create the Auth Context
const AuthContext = createContext();

// Helper function to decode JWT token and extract user ID
function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

// Provider component to wrap your app
export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Check if user token exists in localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save token/user when they change
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [token, user]);

  // Validate token on app load (only once)
  useEffect(() => {
    let isMounted = true;

    const validateToken = async () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && !savedUser) {
        // Decode token to get user ID
        const payload = decodeToken(savedToken);
        if (payload?.id && isMounted) {
          setUser({ id: payload.id });
        } else {
          // Invalid token
          localStorage.removeItem("token");
          if (isMounted) {
            setToken(null);
            setUser(null);
          }
        }
      }
    };

    validateToken();
    return () => {
      isMounted = false;
    };
  }, []); // Function to login with backend
  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Login failed");
      }

      const token = await response.text();
      setToken(token);

      // Decode token to get user ID
      const payload = decodeToken(token);
      setUser({ username, id: payload?.id });

      navigate("/profilepage");
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to register new user
  const register = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Registration failed");
      }

      const token = await response.text();
      setToken(token);

      // Decode token to get user ID
      const payload = decodeToken(token);
      setUser({ username, id: payload?.id });

      navigate("/profilepage");
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }; // Function to log out
  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading, error }}
    >
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
