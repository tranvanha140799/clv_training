'use client';

import { NextPage } from 'next';
import RequireAuth from '@/components/RequireAuth';
import { setCredentials } from '@/redux/slices/authSlice';
import { useAppDispatch } from '@/common/hooks';
import { useEffect } from 'react';
import Container from '@/components/Container';

type HomeProps = {
  params: {};
  searchParams: { accessToken: string };
};

const Home: NextPage<HomeProps> = ({ params, searchParams }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (searchParams.accessToken)
      dispatch(setCredentials({ accessToken: searchParams.accessToken }));
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

export default Home;
