import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosClient from "../api/axiosClient";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axiosClient.get("/auth/me");
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (credentials, roleEndpoint = "/auth/login") => {
    try {
      const response = await axiosClient.post(roleEndpoint, credentials);
      const { token, user: userData } = response.data;
      
      localStorage.setItem("token", token);
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success("Successfully logged in");
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(message);
      throw error;
    }
  };

  // ADDED: Register function
  const register = async (userData, options = { silent: false }) => {
    try {
      const response = await axiosClient.post("/auth/register", userData);
      const { token, user: newUser } = response.data;
      
      // Don't auto-login if it's an admin requesting approval
      if (newUser.role !== "ADMIN") {
        localStorage.setItem("token", token);
        setUser(newUser);
        setIsAuthenticated(true);
      }

      return newUser;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed.";
      if (!options.silent) toast.error(message);
      throw error;
    }
  };

  // ADDED: Refresh profile function (used after image upload)
  const refreshProfile = async () => {
    try {
      const response = await axiosClient.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to refresh profile", error);
    }
  };

  const logout = async (options = { silent: false }) => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    if (!options.silent) toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, refreshProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};