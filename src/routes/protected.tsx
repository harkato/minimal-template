import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated: boolean;
  redirectPath?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated, redirectPath = '/sign-in' }) => 
  isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
;
