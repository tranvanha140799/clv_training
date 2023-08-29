'use client';

import { NextPage } from 'next';
import Header from '@/components/Header';
import RequireAuth from '@/components/RequireAuth';

const Home: NextPage = () => {
  return (
    <RequireAuth>
      <Header />
      <section className="bg-ct-blueprint-600 min-h-[calc(100vh-5rem)] pt-20">
        <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
          <p className="text-5xl font-semibold">Home Page</p>
        </div>
      </section>
    </RequireAuth>
  );
};

export default Home;
