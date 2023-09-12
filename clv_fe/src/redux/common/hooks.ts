import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { useRegisterMutation, useLoginMutation } from '../apis/authApi';
import {
  useGetListUsersQuery,
  useGetUserInformationQuery,
  useUpdateUserInformationMutation,
  useUpdateUserStatusMutation,
} from '../apis/userApi';
import {
  useGetListRoleQuery,
  useGetListPermissionQuery,
  useCreateNewRoleMutation,
  useAssignRoleToUserMutation,
  useEditRolePermissionMutation,
  useEditPermissionRoleMutation,
} from '../apis/permissionApi';

export const apiHooks = {
  // Authentication user
  useRegisterMutation,
  useLoginMutation,

  // Authorization user
  useGetListUsersQuery,
  useGetUserInformationQuery,
  useUpdateUserInformationMutation,
  useUpdateUserStatusMutation,

  // Permission
  useGetListRoleQuery,
  useGetListPermissionQuery,
  useCreateNewRoleMutation,
  useAssignRoleToUserMutation,
  useEditRolePermissionMutation,
  useEditPermissionRoleMutation,
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
