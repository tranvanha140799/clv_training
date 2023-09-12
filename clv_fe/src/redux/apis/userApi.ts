import {
  EDIT_USER_PROFILE_URL,
  EDIT_USER_STATUS_URL,
  GET_LIST_USER_URL,
  GET_USER_PROFILE_URL,
} from '../common/queryUrls';
import { UpdateUser, User } from '../common/types';
import { apiSlice } from './apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListUsers: builder.query<User[], void>({
      query: () => GET_LIST_USER_URL,
      providesTags: (users) => (users ? [{ type: 'USERS', users }] : []),
    }),
    getUserInformation: builder.query<User, void>({
      query: () => GET_USER_PROFILE_URL,
      providesTags: (user) => (user ? [{ type: 'USER_INFORMATION', user }] : []),
    }),
    updateUserInformation: builder.mutation<User, UpdateUser>({
      query: (userInfo: UpdateUser) => ({
        url: EDIT_USER_PROFILE_URL,
        method: 'PUT',
        body: { ...userInfo },
      }),
      invalidatesTags: [{ type: 'USER_INFORMATION' }],
    }),
    updateUserStatus: builder.mutation<void, { email: string }>({
      query: (queryParams) => ({
        url: EDIT_USER_STATUS_URL,
        method: 'PUT',
        body: { ...queryParams },
      }),
      invalidatesTags: [{ type: 'USERS' }],
    }),
  }),
});

export const {
  useGetListUsersQuery,
  useGetUserInformationQuery,
  useUpdateUserInformationMutation,
  useUpdateUserStatusMutation,
} = userApi;
