import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { getDashboardPath } from '../../utils/roleGuard.js';
import type { UserRole } from '../../types/index.js';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole | UserRole[];
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#003366] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role && (Array.isArray(role) ? !role.includes(user.role) : user.role !== role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <>{children}</>;
}
