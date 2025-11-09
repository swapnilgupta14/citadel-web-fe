import { type ReactNode } from "react";
import { auth } from "../../lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute = ({
  children,
  fallback = null,
}: ProtectedRouteProps) => {
  if (!auth.isAuthenticated()) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};
