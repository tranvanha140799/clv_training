/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '@/components/FormInput';
import { LoadingButton } from '@/components/LoadingButton';
import Section from '@/components/Section';
import { TypeOf, object, string } from 'zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { setCredentials } from '@/redux/slices/authSlice';
import { apiHooks } from '@/common/hooks';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import FullScreenLoader from '@/components/FullScreenLoader';
import { customNotification } from '@/common/notification';
import { GoogleOutlined } from '@ant-design/icons';

const loginSchema = object({
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});

export type LoginInput = TypeOf<typeof loginSchema>;

type LoginProps = {};

const LoginPage: NextPage<LoginProps> = ({}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = apiHooks.useLoginMutation();
  const token = useAppSelector((state) => state.authReducer.accessToken);

  useEffect(() => {
    if (token) router.back();
  }, [token]);

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
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
  }, [isSubmitSuccessful]);

  //* Handle submit
  const onSubmitHandler: SubmitHandler<LoginInput> = async (values) => {
    try {
      const response = await login({ info: values }).unwrap();
      dispatch(setCredentials({ accessToken: response.accessToken }));
      customNotification({
        type: 'success',
        message: 'Logged in successfully.',
      });
      reset();
      router.push('/');
    } catch (error: any) {
      customNotification({
        type: 'error',
        message: 'Logged in failed!',
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
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
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
            <LoadingButton loading={isLoading} textColor="text-ct-dark-100">
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
