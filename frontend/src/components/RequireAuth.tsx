import { Navigate, Outlet } from 'react-router-dom';
import { getSessionUser } from '../api/session';

export function RequireAuth() {
  const user = getSessionUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
