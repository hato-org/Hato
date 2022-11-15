import { Navigate, Outlet, ScrollRestoration } from 'react-router-dom';
import { useUser } from '@/hooks/user';
import usePageTracking from '@/hooks/common/ga4';

function RequireLogin() {
  usePageTracking();
  const { data: user } = useUser();

  if (user)
    return (
      <>
        <ScrollRestoration getKey={(location) => location.pathname} />
        <Outlet />
      </>
    );

  return <Navigate to="/login" replace />;
}

export default RequireLogin;
