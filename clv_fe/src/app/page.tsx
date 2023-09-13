'use client';

import { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import RequireAuth from '@/components/RequireAuth';
import { setCredentials } from '@/redux/slices/authSlice';
import { useAppDispatch } from '@/common/hooks';
import { useEffect } from 'react';

const Home: NextPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const accessToken = searchParams.get('accessToken');

  useEffect(() => {
    if (accessToken) dispatch(setCredentials({ accessToken }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <RequireAuth>
      <Header />
      <section className="bg-ct-blueprint-600">
        <div className="max-w-full mx-auto bg-ct-dark-100 rounded-md h-[calc(100vh-5rem)] flex justify-center items-center">
          <p className="text-5xl font-semibold">Home</p>
        </div>
      </section>
    </RequireAuth>
  );
};

export default Home;
