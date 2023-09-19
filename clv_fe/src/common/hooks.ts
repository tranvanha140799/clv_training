import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import {
  useRegisterMutation,
  useLoginMutation,
  useChangeDefaultPasswordMutation,
} from '../redux/apis/authApi';
import {
  useGetListUsersQuery,
  useGetUserInformationQuery,
  useUpdateUserInformationMutation,
  useUpdateUserStatusMutation,
} from '../redux/apis/userApi';
import {
  useGetListRoleQuery,
  useGetListPermissionQuery,
  useCreateNewRoleMutation,
  useAssignRoleToUserMutation,
  useEditRolePermissionMutation,
  useEditPermissionRoleMutation,
} from '../redux/apis/permissionApi';

export {
  // Authentication
  useRegisterMutation,
  useLoginMutation,

  // Authorization
  useGetListUsersQuery,
  useGetUserInformationQuery,
  useUpdateUserInformationMutation,
  useUpdateUserStatusMutation,
  useChangeDefaultPasswordMutation,

  // Role - Permission
  useGetListRoleQuery,
  useGetListPermissionQuery,
  useCreateNewRoleMutation,
  useAssignRoleToUserMutation,
  useEditRolePermissionMutation,
  useEditPermissionRoleMutation,
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
