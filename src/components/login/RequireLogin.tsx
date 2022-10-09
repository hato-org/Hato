import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../hooks/user';

function RequireLogin() {
  const { data: user } = useUser();

  if (user) return <Outlet />;

  return <Navigate to="/login" replace />;
}

export default RequireLogin;
