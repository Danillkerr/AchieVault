import React, { useState, useEffect } from "react";
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
        console.log("Authenticated user:", response.data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
