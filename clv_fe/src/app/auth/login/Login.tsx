/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { setCredentials } from '@/redux/slices/authSlice';
import {
  useResetPasswordMutation,
  useForgotPasswordMutation,
  useLoginMutation,
  useCheckSessionTokenMutation,
  useAppDispatch,
  useAppSelector,
} from '@/common/hooks';
import { FullScreenLoader, Section, FormInput, LoadingButton } from '@/components';
import { customNotification } from '@/common/notification';
import { GoogleOutlined } from '@ant-design/icons';
import {
  ResetPasswordInput,
  ForgotPasswordInput,
  LoginInput,
  resetPasswordSchema,
  forgotPasswordSchema,
  loginSchema,
} from '@/common/types';
import { LoginProps } from './page';
import { Button, Modal } from 'antd';

const LoginPage: NextPage<LoginProps> = ({ searchParams }) => {
  const [isShowForgotPwModal, setIsShowForgotPwModal] = useState(false);
  const [isShowResetPwModal, setIsShowResetPwModal] = useState(false);
  const [login, { isLoading: loggingIn }] = useLoginMutation();
  const [forgotPassword, { isLoading: isSendingRequest }] =
    useForgotPasswordMutation();
  const [checkSession, { isLoading: isCheckingSession }] =
    useCheckSessionTokenMutation();
  const [resetPassword, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();
  const token = useAppSelector((state) => state.authReducer.accessToken);

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) redirect('/');
  }, [token]);

  useEffect(() => {
    if (searchParams.e && searchParams.idToken) setIsShowResetPwModal(true);
    else setIsShowResetPwModal(false);
  }, [searchParams.e, searchParams.idToken]);

  const loginMethods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const { reset: resetLogin, handleSubmit: handleSubmitLogin } = loginMethods;

  const forgotPasswordMethods = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { reset: resetForgotPassword, handleSubmit: handleSubmitForgotPassword } =
    forgotPasswordMethods;

  const resetPasswordMethods = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const {
    reset: resetResetPassword,
    control: resetPasswordControl,
    handleSubmit: handleSubmitResetPassword,
  } = resetPasswordMethods;

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

  //* Handle submit forgot password
  const onSubmitForgotPasswordHandler: SubmitHandler<ForgotPasswordInput> = async (
    values
  ) => {
    try {
      const response = await forgotPassword(values.email).unwrap();
      setIsShowForgotPwModal(false);
      customNotification({
        type: 'success',
        message: response.message,
      });
      resetForgotPassword();
    } catch (error: any) {
      customNotification({
        type: 'error',
        message: 'Failed!',
        description: error?.data?.message,
      });
    }
  };

  //* Handle submit reset password
  const onSubmitResetPasswordHandler: SubmitHandler<ResetPasswordInput> = async (
    values
  ) => {
    const { confirmNewPassword, ...info } = values;
    try {
      const checkSessionResponse = await checkSession({
        email: searchParams.e,
        token: searchParams.idToken,
      }).unwrap();
      if (checkSessionResponse.isValid) {
        const response = await resetPassword(info).unwrap();
        dispatch(setCredentials({ accessToken: response.accessToken }));
        setIsShowResetPwModal(false);
        customNotification({
          type: 'success',
          message: 'Reset password successfully.',
        });
        resetResetPassword();
      } else {
        customNotification({
          type: 'error',
          message: 'The given token in the email has expired!',
          duration: 5,
        });
        router.replace('/auth/login');
      }
    } catch (error: any) {
      console.log('🚀 -> file: Login.tsx:132 -> error:', error);
      customNotification({
        type: 'error',
        message: 'Calling API error occurs!',
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
            <div className="text-right" style={{ marginTop: '0.25rem' }}>
              <Button
                type="link"
                onClick={() => setIsShowForgotPwModal(true)}
                className=""
              >
                Forgot Password?
              </Button>
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
      <Modal
        title="Forgot Password"
        open={isShowForgotPwModal}
        onCancel={() => setIsShowForgotPwModal(false)}
        footer={null}
      >
        <FormProvider {...forgotPasswordMethods}>
          <form
            onSubmit={handleSubmitForgotPassword(onSubmitForgotPasswordHandler)}
            className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
          >
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="abc123@mail.com"
            />
            <LoadingButton loading={isSendingRequest} textColor="text-ct-dark-100">
              Get Recovery Email
            </LoadingButton>
            <button
              className="w-full py-3 font-semibold bg-ct-blueprint-600 rounded-lg outline-none border-none flex justify-center"
              onClick={() => {
                setIsShowForgotPwModal(false);
                resetForgotPassword();
              }}
            >
              <span className="text-ct-dark-100">Cancel</span>
            </button>
          </form>
        </FormProvider>
      </Modal>
      <Modal
        title="Reset Password"
        open={isShowResetPwModal}
        footer={null}
      >
        <FormProvider {...resetPasswordMethods}>
          <form
            onSubmit={handleSubmitResetPassword(onSubmitResetPasswordHandler)}
            className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
          >
            <Controller
              name="email"
              control={resetPasswordControl}
              defaultValue={searchParams.e ? searchParams.e : ''}
              render={() => (
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="abc123@mail.com"
                  defaultValue={searchParams.e ? searchParams.e : ''}
                  isDisabled={true}
                />
              )}
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
            <LoadingButton loading={isResettingPassword} textColor="text-ct-dark-100">
              Confirm
            </LoadingButton>
            {/* <button
              className="w-full py-3 font-semibold bg-ct-blueprint-600 rounded-lg outline-none border-none flex justify-center"
              onClick={() => {
                setIsShowResetPwModal(false);
                resetResetPassword();
              }}
            >
              <span className="text-ct-dark-100">Cancel</span>
            </button> */}
          </form>
        </FormProvider>
      </Modal>
    </Section>
  ) : (
    <FullScreenLoader />
  );
};

export default LoginPage;
