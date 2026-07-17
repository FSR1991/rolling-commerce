import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading, token, error } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Verificando acceso...</p>;
  }

  if (!isAuthenticated) {
    if (token && error) {
      return <p>{error}</p>;
    }

    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
