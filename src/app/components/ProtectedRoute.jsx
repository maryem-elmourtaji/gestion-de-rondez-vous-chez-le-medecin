import { Navigate } from 'react-router';
import { getUserFromStorage } from '../utils/auth';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = getUserFromStorage();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
