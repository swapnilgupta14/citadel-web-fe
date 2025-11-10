import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../lib/storage/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!auth.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};
