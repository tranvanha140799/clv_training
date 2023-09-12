import { LOGIN_URL, REGISTER_URL } from '../common/queryUrls';
import { LoginInfo, RegisterInfo, User } from '../common/types';
import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<User, { info: RegisterInfo }>({
      query: ({ info }) => ({
        url: REGISTER_URL,
        method: 'POST',
        body: info,
      }),
    }),
    login: builder.mutation<User, { info: LoginInfo }>({
      query: ({ info }) => ({
        url: LOGIN_URL,
        method: 'POST',
        body: info,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
