import {
  Navigate,
  Outlet,
  ScrollRestoration,
  useLocation,
} from 'react-router-dom';
import { useAtomValue } from 'jotai';
import usePageTracking from '@/hooks/common/ga4';
import PageContainer from '../layout/PageContainer';
import { jwtAtom } from '@/store/auth';

function RequireLogin() {
  usePageTracking();
  const location = useLocation();
  const jwt = useAtomValue(jwtAtom);

  if (jwt)
    return (
      <PageContainer>
        <>
          <ScrollRestoration getKey={(loc) => loc.pathname} />
          <Outlet />
        </>
      </PageContainer>
    );

  return (
    <Navigate
      to={`/login?return_to=${location.pathname + location.search}`}
      replace
    />
  );
}

export default RequireLogin;
