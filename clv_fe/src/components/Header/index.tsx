import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Modal } from 'antd';
import { useAppDispatch, useGetUserInformationQuery } from '@/common/hooks';
import { logout } from '@/redux/slices/authSlice';
import logo from '../../app/images/clv-logo.webp';
import Image from 'next/image';
import { customNotification } from '@/common/notification';
import { apiSlice } from '@/redux/apis/apiSlice';

export const Header: React.FC = () => {
  const store = { pageLoading: false }; //TODO: Refactor later...
  const { data: user } = useGetUserInformationQuery();
  const [isShowModal, setIsShowModal] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <>
      <header className="bg-ct-blueprint-600 h-20">
        <nav className="h-full flex justify-between container items-center">
          <div>
            <Link href="/" className="text-ct-dark-100 text-2xl font-semibold">
              <Image src={logo} alt="CLV Logo" />
            </Link>
          </div>
          <ul className="flex items-center gap-4">
            {!user && (
              <>
                <li>
                  <Link href="/register" className="text-ct-dark-100">
                    SignUp
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-ct-dark-100">
                    Login
                  </Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li className="cursor-pointer text-ct-dark-100">
                  <Link href="/profile" className="text-ct-dark-100">
                    Profile
                  </Link>
                </li>
                <li className="cursor-pointer text-ct-dark-100">
                  <Link href="/user-management">User</Link>
                </li>
                <li className="cursor-pointer text-ct-dark-100">
                  <Link href="/role-management">Role</Link>
                </li>
                <li className="cursor-pointer text-ct-dark-100">
                  <Link href="/permission-management">Permission</Link>
                </li>
                <li
                  className="cursor-pointer text-ct-dark-100"
                  onClick={() => setIsShowModal(true)}
                >
                  Log out
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      {/* <div className="pt-4 pl-2 bg-ct-blue-600 fixed">
        {store.pageLoading && <Spinner color="text-ct-yellow-600" />}
      </div> */}
      <Modal
        title="Log out Confirmation"
        open={isShowModal}
        onCancel={() => setIsShowModal(false)}
        footer={
          <div className="mt-4 text-center">
            <Button
              onClick={() => {
                dispatch(logout());
                dispatch(apiSlice.util.resetApiState());
                setIsShowModal(false);
                customNotification({
                  type: 'info',
                  message: 'Logged out successfully.',
                });
              }}
              className="bg-ct-blueprint-600 mr-3 text-ct-dark-100"
            >
              Confirm
            </Button>
            <Button onClick={() => setIsShowModal(false)}>Cancel</Button>
          </div>
        }
      >
        Are you sure you want to log out?
      </Modal>
    </>
  );
};
