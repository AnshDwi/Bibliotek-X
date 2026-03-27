import { createContext, useContext, useEffect, useState } from "react";

import { api } from "../api/http.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("bibliotek-x-token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (_error) {
        localStorage.removeItem("bibliotek-x-token");
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  const login = async (payload) => {
    const response = await api.post("/auth/login", payload);
    localStorage.setItem("bibliotek-x-token", response.data.accessToken);
    setUser(response.data.user);
    return response.data.user;
  };

  const register = async (payload) => {
    await api.post("/auth/register", payload);
    return login({
      email: payload.email,
      password: payload.password
    });
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_error) {
      // Ignore logout network errors in demo mode.
    }
    localStorage.removeItem("bibliotek-x-token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
