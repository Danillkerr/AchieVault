import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../services/apiClient";
import { AuthContext } from "./useAuthContext";
import type { User } from "../types/user.interface";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await apiClient.get("/auth/me");
        setUser(response.data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
