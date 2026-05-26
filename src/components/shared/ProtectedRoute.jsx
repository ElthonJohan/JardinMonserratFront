import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, allowedPermissions = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Verificando autenticación..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ==================== LÓGICA PARA APODERADOS ====================
  if (allowedPermissions.includes("parent")) {
    const isParent = user?.user_type === "parent" || 
                     localStorage.getItem("userType") === "parent";
    
    if (!isParent) {
      return <Navigate to="/login" replace />;
    }
    return children;   // Permitir acceso a intranet
  }

  // ==================== LÓGICA PARA USUARIOS ADMINISTRATIVOS ====================
  if (allowedPermissions && allowedPermissions.length > 0 && user) {
    const hasPermission = allowedPermissions.some((perm) => 
      user.permissions?.includes(perm)
    );
    
    if (!hasPermission) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;