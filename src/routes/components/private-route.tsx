import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated: boolean;
  redirectPath?: string;
  children: ReactNode;
}

export function PrivateRoute({
  isAuthenticated,
  redirectPath = '/sign-in',
  children,
}: PrivateRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  return <>{children}</>;
}
