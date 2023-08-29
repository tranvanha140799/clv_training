import { useRegisterMutation, useLoginMutation } from './authApi';
import { useGetListUsersQuery, useGetUserByIdQuery } from './userApi';

const apiHooks = {
  // Authentication user
  useRegisterMutation,
  useLoginMutation,
  // Authorization user
  useGetListUsersQuery,
  useGetUserByIdQuery,
};

export default apiHooks;
