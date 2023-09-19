'use client';

import { useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterMutation, useAppSelector } from '@/common/hooks';
import { FormInput, FullScreenLoader, LoadingButton, Section } from '@/components';
import { useAppDispatch } from '@/common/hooks';
import { setCredentials } from '@/redux/slices/authSlice';
import { customNotification } from '@/common/notification';
import { RegisterInput, registerSchema } from '@/common/types';
import { RegisterProps } from './page';

const RegisterPage: NextPage<RegisterProps> = ({}) => {
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const token: string = useAppSelector((state) => state.authReducer.accessToken);

  useEffect(() => {
    if (token) redirect('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      // reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  //* Handle submit
  const onSubmitHandler: SubmitHandler<RegisterInput> = async (values) => {
    const { passwordConfirm, ...args } = values;
    try {
      const response = await register({ info: args }).unwrap();
      dispatch(setCredentials({ accessToken: response.accessToken }));
      customNotification({
        type: 'success',
        message: 'Registered successfully!',
      });
    } catch (error: any) {
      customNotification({
        type: 'error',
        message: 'Registered failed!',
        description: error?.data?.message,
      });
    }
  };

  return !token ? (
    <Section>
      <div className="w-96 absolute top-[15%] right-8">
        <h2 className="text-4xl text-center font-[600] text-ct-dark-100 mb-4">
          Create an Account
        </h2>
        <h6 className="text-lg text-center mb-4 text-ct-dark-200">
          Let&apos;s get started with your 30-day free trial.
        </h6>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
          >
            <FormInput
              label="First Name"
              name="firstName"
              placeholder="Your first name"
            />
            <FormInput
              label="Last Name"
              name="lastName"
              placeholder="Your last name"
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="abc123@mail.com"
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="Type your password"
            />
            <FormInput
              label="Confirm Password"
              name="passwordConfirm"
              type="password"
              placeholder="Confirm your password"
            />
            <LoadingButton loading={isLoading} textColor="text-ct-dark-100">
              Register
            </LoadingButton>
            <span className="block">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-ct-blue-600">
                Log in Here
              </Link>
            </span>
          </form>
        </FormProvider>
      </div>
    </Section>
  ) : (
    <FullScreenLoader />
  );
};

export default RegisterPage;
