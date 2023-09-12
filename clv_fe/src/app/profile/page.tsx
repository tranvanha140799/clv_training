'use client';

import type { NextPage } from 'next';
import Header from '@/components/Header';
import { apiHooks, useAppDispatch } from '@/redux/common/hooks';
import RequireAuth from '@/components/RequireAuth';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { customNotification } from '@/redux/common/notification';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import FormInput from '@/components/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { TypeOf, object, string } from 'zod';
import { LoadingButton } from '@/components/LoadingButton';

type ProfileProps = {};

// Schema for validating update user information
const updateUserInformationSchema = object({
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  firstName: string().min(1, 'First name is required').max(100),
  lastName: string().min(1, 'Last name is required').max(100),
  globalId: string().max(10),
  country: string().max(20),
  officeCode: string().max(10),
});

export type UpdateInput = TypeOf<typeof updateUserInformationSchema>;

const ProfilePage: NextPage<ProfileProps> = ({}) => {
  const { data: user } = apiHooks.useGetUserInformationQuery();
  const [updateUserInformation, { data, isLoading, error }] =
    apiHooks.useUpdateUserInformationMutation();
  const [isShowModal, setIsShowModal] = useState(false);

  const dispatch = useAppDispatch();

  const methods = useForm<UpdateInput>({
    resolver: zodResolver(updateUserInformationSchema),
  });
  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  const onSubmitHandler: SubmitHandler<UpdateInput> = async (values) => {
    try {
      const response = await updateUserInformation({ ...values }).unwrap();
      setIsShowModal(false);
      customNotification({
        type: 'success',
        message: 'Changed user information successfully!',
      });
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
      <Header />
      <section className="bg-ct-blueprint-600">
        <div className="max-w-full mx-auto bg-ct-dark-100 rounded-md h-[calc(100vh-5rem)] flex justify-center items-baseline">
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
                <p className="mb-4">
                  Email: {user && user.email ? user.email : 'N/A'}
                </p>
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
              <Button onClick={() => setIsShowModal(true)}>Edit Profile</Button>
            </div>
          </div>
        </div>
      </section>
      <Modal
        title="Change User Profile"
        onCancel={() => setIsShowModal(false)}
        open={isShowModal}
        footer={null}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
          >
            <Controller
              name="email"
              control={control}
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
            <LoadingButton loading={isLoading} textColor="text-ct-dark-100">
              Confirm
            </LoadingButton>
            <button
              className="w-full py-3 font-semibold bg-ct-blueprint-600 rounded-lg outline-none border-none flex justify-center"
              onClick={() => {
                setIsShowModal(false);
                reset();
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
