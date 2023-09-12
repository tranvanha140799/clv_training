import { useAppDispatch, useAppSelector } from '@/redux/common/hooks';
import { LOGIN_URL } from '@/redux/common/queryUrls';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import FullScreenLoader from './FullScreenLoader';
import { isSignedIn, logout } from '@/redux/slices/authSlice';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAppSelector((state) => state.authReducer.accessToken);
  const userInfo = useAppSelector((state) => state.authReducer.userInfo);
  const router = useRouter();
  const dispatch = useAppDispatch();

  if (!token) dispatch(isSignedIn());

  // window.addEventListener('beforeunload', () => dispatch(logout()));

  useEffect(() => {
    if (!token && !userInfo.email) router.push(LOGIN_URL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return token && userInfo && userInfo.email ? <>{children}</> : <FullScreenLoader />;
};

export default RequireAuth;
