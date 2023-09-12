'use client';

import { NextPage } from 'next';
import Header from '@/components/Header';
import RequireAuth from '@/components/RequireAuth';

const Home: NextPage = () => {
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
