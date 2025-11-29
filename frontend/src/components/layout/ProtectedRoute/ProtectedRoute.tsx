import React from "react";
import { useAuth } from "../../../context/useAuthContext";
import { Navigate } from "react-router-dom";
import { ScreenLoader } from "@/components/feedback/ScreenLoader/ScreenLoader";
import { useTranslation } from "react-i18next";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return <ScreenLoader text={t("loading.auth")} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
