import { useAppSelector } from '@/redux/common/hooks';
import { loginUrl } from '@/redux/common/queryUrls';
import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';
import FullScreenLoader from './FullScreenLoader';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAppSelector((state) => state.authReducer.accessToken);
  const router = useRouter();

  useLayoutEffect(() => {
    if (!token) router.push(loginUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return token ? <>{children}</> : <FullScreenLoader />;
};

export default RequireAuth;
