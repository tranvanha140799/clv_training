'use client';

import { loginUrl, registerUrl } from '../common/queryUrls';
import { LoginInfo, RegisterInfo, User } from '../common/types';
import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<User, { info: RegisterInfo }>({
      query: ({ info }) => ({
        url: registerUrl,
        method: 'POST',
        body: info,
      }),
    }),
    login: builder.mutation<User, { info: LoginInfo }>({
      query: ({ info }) => ({
        url: loginUrl,
        method: 'POST',
        body: info,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
