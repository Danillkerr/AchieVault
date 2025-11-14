import React from "react";
import { useAuth } from "../../../context/useAuthContext";
import { Navigate } from "react-router-dom";
import { ScreenLoader } from "../../common/ScreenLoader/ScreenLoader";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <ScreenLoader text="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
