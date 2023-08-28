'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import FormInput from '@/components/FormInput';
import { LoadingButton } from '@/components/LoadingButton';
import Section from '@/components/Section';

const RegisterPage: NextPage = () => {
  const handleSubmit = () => {};

  return (
    <Section>
      <div className="w-96 absolute top-[20%] right-8">
        <h2 className="text-4xl text-center font-[600] text-ct-dark-100 mb-4">
          Create an Account
        </h2>
        <h6 className="text-lg text-center mb-4 text-ct-dark-200">
          Let&apos;s get started with your 30-day free trial.
        </h6>
        {/* <FormProvider {...methods}> */}
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
        >
          <FormInput label="Full Name" name="name" placeholder="Your full name" />
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
          {/* <FileUpLoader name="photo" /> */}
          <LoadingButton loading={false} textColor="text-ct-dark-100">
            Sign Up
          </LoadingButton>
          <span className="block">
            Already have an account?{' '}
            <Link href="/login" className="text-ct-blue-600">
              Login Here
            </Link>
          </span>
        </form>
        {/* </FormProvider> */}
      </div>
    </Section>
  );
};

export default RegisterPage;
