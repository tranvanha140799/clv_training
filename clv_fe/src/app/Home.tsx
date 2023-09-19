'use client';

import { NextPage } from 'next';
import { setCredentials } from '@/redux/slices/authSlice';
import { useAppDispatch } from '@/common/hooks';
import { useEffect } from 'react';
import { Container, RequireAuth } from '@/components';
import { customNotification } from '@/common/notification';
import { HomeProps } from './page';

const HomePage: NextPage<HomeProps> = ({ searchParams }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (searchParams.accessToken) {
      dispatch(setCredentials({ accessToken: searchParams.accessToken }));
      customNotification({
        type: 'success',
        message: 'Logged in with Google successfully.',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.accessToken]);

  return (
    <RequireAuth>
      <Container>
        <p className="text-5xl font-semibold">Home</p>
      </Container>
    </RequireAuth>
  );
};

export default HomePage;
