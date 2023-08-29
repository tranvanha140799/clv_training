import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { useRegisterMutation, useLoginMutation } from '../apis/authApi';
import { useGetListUsersQuery, useGetUserByIdQuery } from '../apis/userApi';

export const apiHooks = {
  // Authentication user
  useRegisterMutation,
  useLoginMutation,
  // Authorization user
  useGetListUsersQuery,
  useGetUserByIdQuery,
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
