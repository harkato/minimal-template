import React, { ReactNode } from "react";
import { Navigate, Outlet, OutletProps } from "react-router-dom";
import { useAuth } from "src/context/AuthProvider";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({
  children,
}: PrivateRouteProps) {
  const user = useAuth();
  if (!user?.token) return <Navigate to="/sign-in" />;
  return <>{children}</>;
};
