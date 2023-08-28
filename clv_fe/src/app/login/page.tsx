'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import FormInput from '@/components/FormInput';
import { LoadingButton } from '@/components/LoadingButton';
import Section from '@/components/Section';

const LoginPage: NextPage = () => {
  const handleSubmit = () => {};

  return (
    <Section>
      <div className="w-96 absolute top-[25%] right-8">
        <h2 className="text-4xl text-center font-[600] text-ct-dark-100 mb-4">
          Welcome Back
        </h2>
        <h6 className="text-lg text-center mb-4 text-ct-dark-200">
          Welcome back! Please enter your details
        </h6>
        {/* <FormProvider {...methods}> */}
        <form
          onSubmit={handleSubmit}
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
          <LoadingButton loading={false} textColor="text-ct-dark-100">
            Login
          </LoadingButton>
          <span className="block">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-ct-blue-600">
              Sign Up Here
            </Link>
          </span>
        </form>
        {/* </FormProvider> */}
      </div>
    </Section>
  );
};

export default LoginPage;
