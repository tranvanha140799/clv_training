import {
  CHANGE_PASSWORD_URL,
  CHECK_SESSION_TOKEN,
  FORGOT_PASSWORD_URL,
  LOGIN_URL,
  REGISTER_URL,
  RESET_PASSWORD_URL,
} from '../../common/queryUrls';
import {
  ChangePassword,
  LoginInfo,
  RegisterInfo,
  ResetPassword,
  User,
  ValidSession,
} from '../../common/types';
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
    checkSessionToken: builder.mutation<{ isValid: boolean }, ValidSession>({
      query: (validSession) => ({
        url: CHECK_SESSION_TOKEN,
        method: 'POST',
        body: validSession,
      }),
    }),
    changePassword: builder.mutation<User, ChangePassword>({
      query: (info) => ({
        url: CHANGE_PASSWORD_URL,
        method: 'PUT',
        body: info,
      }),
    }),
    forgotPassword: builder.mutation<{ message: string }, string>({
      query: (email) => ({
        url: FORGOT_PASSWORD_URL,
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<User, ResetPassword>({
      query: (info) => ({
        url: RESET_PASSWORD_URL,
        method: 'POST',
        body: info,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useCheckSessionTokenMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
