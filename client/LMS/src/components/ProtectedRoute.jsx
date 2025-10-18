import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role = null }) {
  const { currentUser, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to dashboard
  if (role && currentUser?.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and role matches (or no role required), render children
  return children;
}
