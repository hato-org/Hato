import { Navigate, Outlet, ScrollRestoration } from 'react-router-dom';
import { useUser } from '@/hooks/user';
import usePageTracking from '@/hooks/common/ga4';
import PageContainer from '../layout/PageContainer';

function RequireLogin() {
  usePageTracking();
  const { data: user } = useUser();

  if (user)
    return (
      <PageContainer>
        <>
          <ScrollRestoration getKey={(location) => location.pathname} />
          <Outlet />
        </>
      </PageContainer>
    );

  return <Navigate to="/login" replace />;
}

export default RequireLogin;
