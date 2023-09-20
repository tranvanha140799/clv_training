'use client';

import type { NextPage } from 'next';
import {
  useGetUserInformationQuery,
  useChangePasswordMutation,
  useUpdateUserInformationMutation,
} from '@/common/hooks';
import { Button, Modal, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { customNotification } from '@/common/notification';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RequireAuth, FormInput, Container, LoadingButton } from '@/components';
import {
  ChangePasswordInput,
  UpdateProfileInput,
  changePasswordSchema,
  updateProfileSchema,
} from '@/common/types';
import { ProfileProps } from './page';

const ProfilePage: NextPage<ProfileProps> = ({ searchParams }) => {
  const [isShowProfileModal, setIsShowProfileModal] = useState(false);
  const [isShowPasswordModal, setIsShowPasswordModal] = useState(false);
  const { data: user } = useGetUserInformationQuery();
  const [changePassword, { isLoading: changingPassword, error: changePasswordError }] =
    useChangePasswordMutation();
  const [updateUserInformation, { data, isLoading: updatingProfile, error }] =
    useUpdateUserInformationMutation();

  useEffect(() => {
    if (searchParams.e === user?.email && searchParams.idToken)
      setIsShowPasswordModal(true);
  }, [user?.email, searchParams.e, searchParams.idToken]);

  const updateProfileMethods = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
  });
  const {
    reset: resetUpdateProfile,
    control: updateProfileControl,
    handleSubmit: handleSubmitUpdateProfile,
  } = updateProfileMethods;

  const changePasswordMethods = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });
  const {
    reset: resetChangePassword,
    control: changePasswordControl,
    handleSubmit: handleSubmitChangePassword,
  } = changePasswordMethods;

  //* Handle submit update profile
  const onSubmitProfileHandler: SubmitHandler<UpdateProfileInput> = async (values) => {
    try {
      const response = await updateUserInformation({ ...values }).unwrap();
      setIsShowProfileModal(false);
      customNotification({
        type: 'success',
        message: 'Changed user information successfully!',
      });
      resetUpdateProfile();
    } catch (error: any) {
      customNotification({
        type: 'error',
        message: 'Failed!',
        description: error?.data?.message,
      });
    }
  };

  //* Handle submit change default password
  const onSubmitPasswordHandler: SubmitHandler<ChangePasswordInput> = async (
    values
  ) => {
    const { confirmNewPassword, ...info } = values;
    try {
      const response = await changePassword(info).unwrap();
      setIsShowPasswordModal(false);
      customNotification({
        type: 'success',
        message: 'Changed password successfully.',
      });
      resetChangePassword();
    } catch (error: any) {
      customNotification({
        type: 'error',
        message: 'Failed!',
        description: error?.data?.message,
      });
    }
  };

  return (
    <RequireAuth>
      <Container>
        <div className="w-4/6">
          <p className="text-5xl font-semibold text-center">Profile</p>
          <div className="mt-40 flex justify-around">
            <div>
              <p className="mb-4">
                First Name: {user && user.firstName ? user.firstName : 'N/A'}
              </p>
              <p className="mb-4">
                Last Name: {user && user.lastName ? user.lastName : 'N/A'}
              </p>
              <p className="mb-4">Email: {user && user.email ? user.email : 'N/A'}</p>
            </div>
            <div>
              <p className="mb-4">
                Global ID: {user && user.globalId ? user.globalId : 'N/A'}
              </p>
              <p className="mb-4">
                Country: {user && user.country ? user.country : 'N/A'}
              </p>
              <p className="mb-4">
                Office: {user && user.officeCode ? user.officeCode : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="mb-4">
              Role:{' '}
              <Tag
                color={
                  user &&
                  'roles' in user &&
                  user.roles &&
                  user.roles.length &&
                  user.roles[0].name === 'USER'
                    ? 'green'
                    : user &&
                      'roles' in user &&
                      user.roles &&
                      user.roles.length &&
                      user?.roles[0]?.name === 'ASSISTANCE'
                    ? 'orange'
                    : user &&
                      'roles' in user &&
                      user.roles &&
                      user.roles.length &&
                      user?.roles[0]?.name === 'MODIFIER'
                    ? 'volcano'
                    : user &&
                      'roles' in user &&
                      user.roles &&
                      user.roles.length &&
                      user?.roles[0]?.name === 'ADMIN'
                    ? 'red'
                    : user &&
                      'roles' in user &&
                      user.roles &&
                      user.roles.length &&
                      user?.roles[0]?.name === 'MASTER'
                    ? 'magenta'
                    : ''
                }
              >
                {user && user.roles && user.roles.length ? user?.roles[0].name : 'N/A'}
              </Tag>
            </div>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => setIsShowProfileModal(true)}>Edit Profile</Button>
            <Button className="ml-4" onClick={() => setIsShowPasswordModal(true)}>
              Change Password
            </Button>
          </div>
        </div>
      </Container>
      <Modal
        title="Update Profile"
        onCancel={() => setIsShowProfileModal(false)}
        open={isShowProfileModal}
        footer={null}
      >
        <FormProvider {...updateProfileMethods}>
          <form
            onSubmit={handleSubmitUpdateProfile(onSubmitProfileHandler)}
            className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
          >
            <Controller
              name="email"
              control={updateProfileControl}
              defaultValue={user?.email}
              render={() => (
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="abc123@mail.com"
                  defaultValue={user?.email}
                  isDisabled={true}
                />
              )}
            />
            <FormInput
              label="First Name"
              name="firstName"
              placeholder="Your first name"
              defaultValue={user?.firstName}
            />
            <FormInput
              label="Last Name"
              name="lastName"
              placeholder="Your last name"
              defaultValue={user?.lastName}
            />
            <FormInput
              label="Global ID"
              name="globalId"
              placeholder="Your global ID"
              defaultValue={user?.globalId || ''}
            />
            <FormInput
              label="Country"
              name="country"
              placeholder="Your country"
              defaultValue={user?.country || ''}
            />
            <FormInput
              label="Office Code"
              name="officeCode"
              placeholder="Your office code"
              defaultValue={user?.officeCode || ''}
            />
            <LoadingButton loading={updatingProfile} textColor="text-ct-dark-100">
              Confirm
            </LoadingButton>
            <button
              className="w-full py-3 font-semibold bg-ct-blueprint-600 rounded-lg outline-none border-none flex justify-center"
              onClick={() => {
                setIsShowProfileModal(false);
                resetUpdateProfile();
              }}
            >
              <span className="text-ct-dark-100">Cancel</span>
            </button>
          </form>
        </FormProvider>
      </Modal>
      <Modal
        title="Change Password"
        open={isShowPasswordModal}
        onCancel={() => setIsShowPasswordModal(false)}
        footer={null}
      >
        <FormProvider {...changePasswordMethods}>
          <form
            onSubmit={handleSubmitChangePassword(onSubmitPasswordHandler)}
            className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
          >
            <Controller
              name="email"
              control={changePasswordControl}
              defaultValue={user?.email}
              render={() => (
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="abc123@mail.com"
                  defaultValue={user?.email}
                  isDisabled={true}
                />
              )}
            />
            <FormInput
              label="Current Password"
              name="currentPassword"
              type="password"
              placeholder="Type your current password"
            />
            <FormInput
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="Type your new password"
            />
            <FormInput
              label="Confirm New Password"
              name="confirmNewPassword"
              type="password"
              placeholder="Confirm your new password"
            />
            <LoadingButton loading={changingPassword} textColor="text-ct-dark-100">
              Confirm
            </LoadingButton>
            <button
              className="w-full py-3 font-semibold bg-ct-blueprint-600 rounded-lg outline-none border-none flex justify-center"
              onClick={() => {
                setIsShowPasswordModal(false);
                resetChangePassword();
              }}
            >
              <span className="text-ct-dark-100">Cancel</span>
            </button>
          </form>
        </FormProvider>
      </Modal>
    </RequireAuth>
  );
};

export default ProfilePage;
