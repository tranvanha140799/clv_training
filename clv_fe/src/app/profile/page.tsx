'use client';

import type { NextPage } from 'next';
import Header from '@/components/Header';
import { useAppSelector } from '@/redux/common/hooks';
import RequireAuth from '@/components/RequireAuth';

type ProfileProps = {};

const ProfilePage: NextPage<ProfileProps> = ({}) => {
  const user = useAppSelector((state) => state.authReducer.userInfo);

  return (
    <RequireAuth>
      <Header />
      <section className="min-h-[calc(100vh-5rem)] pt-20 bg-ct-blueprint-600">
        <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
          <div>
            <p className="text-5xl font-semibold">Profile Page</p>
            <div className="mt-8">
              <p className="mb-4">First Name: {user?.firstName}</p>
              <p className="mb-4">Last Name: {user?.lastName}</p>
              <p className="mb-4">Email: {user?.email}</p>
            </div>
          </div>
        </div>
      </section>
    </RequireAuth>
  );
};

export default ProfilePage;
