import React, { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { AuthContext } from "./useAuthContext";
import type { User } from "@/types/user.interface";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<User>("/auth/me");
        return response.data;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 15,
  });

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated: !!user,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
