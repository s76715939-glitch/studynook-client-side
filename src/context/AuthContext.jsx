import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext(undefined);
const API_URL = import.meta.env.VITE_API_URL;
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current logged-in user on app mount
  const refreshUser = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Failed to check authentication", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(
          data.error || "Login failed. Please check your credentials.",
        );
        return false;
      }
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      return true;
    } catch (err) {
      toast.error("An error occurred during login. Please try again.");
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Registration failed.");
        return false;
      }
      toast.success(data.message || "Registration successful! Please login.");
      return true;
    } catch (err) {
      toast.error("An error occurred during registration.");
      return false;
    }
  };

  const loginWithGoogle = async (googleData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Google sign-in failed.");
        return false;
      }
      setUser(data.user);
      toast.success(`Logged in with Google as ${data.user.name}!`);
      return true;
    } catch (err) {
      toast.error("Google authentication failed.");
      return false;
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/logout`, {
        credentials: "include",
        method: "POST",
      });
      if (res.ok) {
        setUser(null);
        toast.success("Successfully logged out. See you soon!");
      } else {
        toast.error("Logout failed.");
      }
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update profile.");
        return false;
      }
      setUser(data.user);
      toast.success("Profile updated successfully!");
      return true;
    } catch (err) {
      toast.error("An error occurred while updating your profile.");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
