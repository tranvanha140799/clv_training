/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { setCredentials } from '@/redux/slices/authSlice';
import { useLoginMutation } from '@/common/hooks';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { FullScreenLoader, Section, FormInput, LoadingButton } from '@/components';
import { customNotification } from '@/common/notification';
import { GoogleOutlined } from '@ant-design/icons';
import { LoginInput, loginSchema } from '@/common/types';
import { LoginProps } from './page';

const LoginPage: NextPage<LoginProps> = ({}) => {
  const [login, { isLoading: loggingIn }] = useLoginMutation();
  const token = useAppSelector((state) => state.authReducer.accessToken);

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) router.back();
  }, [token]);

  const loginMethods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const {
    reset: resetLogin,
    handleSubmit: handleSubmitLogin,
    formState: { isSubmitSuccessful: isSubmitLogInSuccessful },
  } = loginMethods;

  useEffect(() => {
    if (isSubmitLogInSuccessful) {
      // reset();
    }
  }, [isSubmitLogInSuccessful]);

  //* Handle submit log in
  const onSubmitLoginHandler: SubmitHandler<LoginInput> = async (values) => {
    try {
      const response = await login({ info: values }).unwrap();
      dispatch(setCredentials({ accessToken: response.accessToken }));
      customNotification({
        type: 'success',
        message: 'Logged in successfully.',
      });
      resetLogin();
    } catch (error: any) {
      customNotification({
        type: 'error',
        message: 'Failed!',
        description: error?.data?.message,
      });
    }
  };

  return !token ? (
    <Section>
      <div className="w-96 absolute top-[25%] right-8">
        <h2 className="text-4xl text-center font-[600] text-ct-dark-100 mb-4">
          Welcome Back
        </h2>
        <h6 className="text-lg text-center mb-4 text-ct-dark-200">
          Welcome back! Please enter your details
        </h6>
        <FormProvider {...loginMethods}>
          <form
            onSubmit={handleSubmitLogin(onSubmitLoginHandler)}
            className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
          >
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
            <div className="text-right">
              <Link href="#" className="">
                Forgot Password?
              </Link>
            </div>
            <LoadingButton loading={loggingIn} textColor="text-ct-dark-100">
              Log in
            </LoadingButton>
            <button
              className="w-full py-3 font-semibold bg-ct-blueprint-600 text-ct-dark-100 rounded-lg outline-none border-none flex justify-center items-center"
              type="button"
              onClick={() => router.push('http://localhost:8000/auth/google')}
            >
              <GoogleOutlined className="mr-4" />
              Log in with Google
            </button>
            <span className="block">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-ct-blue-600">
                Register Here
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

export default LoginPage;
