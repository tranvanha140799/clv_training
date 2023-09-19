import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { LOGIN_URL } from '@/common/queryUrls';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { isSignedIn } from '@/redux/slices/authSlice';
import { RedirectType } from 'next/dist/client/components/redirect';
import { FullScreenLoader } from '..';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAppSelector((state) => state.authReducer.accessToken);
  const dispatch = useAppDispatch();

  if (!token) dispatch(isSignedIn());

  useEffect(() => {
    if (!token) redirect(LOGIN_URL, RedirectType.push);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return token ? <>{children}</> : <FullScreenLoader />;
};
