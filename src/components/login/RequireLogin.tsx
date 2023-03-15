import { Navigate, Outlet, ScrollRestoration } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import usePageTracking from '@/hooks/common/ga4';
import PageContainer from '../layout/PageContainer';
import { jwtAtom } from '@/store/auth';

function RequireLogin() {
  usePageTracking();
  const jwt = useRecoilValue(jwtAtom);

  if (jwt)
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
