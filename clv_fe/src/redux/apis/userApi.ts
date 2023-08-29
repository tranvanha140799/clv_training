import { User } from '../common/types';
import { apiSlice } from './apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListUsers: builder.query<User[], null>({
      query: () => 'users',
    }),
    getUserById: builder.query<User, { id: string }>({
      query: ({ id }) => `users/${id}`,
    }),
  }),
});

export const { useGetListUsersQuery, useGetUserByIdQuery } = userApi;
