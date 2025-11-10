import { type ReactNode, useEffect } from "react";
import { auth } from "../../lib/storage/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute = ({
  children,
  fallback = null,
}: ProtectedRouteProps) => {
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      auth.clearAll();
      window.location.href = "/";
    }
  }, []);

  if (!auth.isAuthenticated()) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};
