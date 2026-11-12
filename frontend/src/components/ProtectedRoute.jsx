import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, children }) {
  // Verifica la sesión en estado o en localStorage
  const activeUser = user || JSON.parse(localStorage.getItem('user'));

  if (!activeUser) {
    alert('Debes iniciar sesión para acceder al panel de administración.');
    return <Navigate to="/auth" replace />;
  }

  return children;
}