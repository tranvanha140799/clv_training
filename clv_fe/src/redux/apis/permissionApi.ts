import {
  ADD_NEW_ROLE_URL,
  ASSIGN_ROLE_TO_USER_URL,
  EDIT_PERMISSION_ROLE_URL,
  EDIT_ROLE_PERMISSION_URL,
  GET_LIST_PERMISSION_URL,
  GET_LIST_ROLE_URL,
} from '../../common/queryUrls';
import { Permission, Role } from '../../common/types';
import { apiSlice } from './apiSlice';

export const permissionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListRole: builder.query<Role[], void>({
      query: () => GET_LIST_ROLE_URL,
      providesTags: () => [{ type: 'ROLES' }],
    }),
    getListPermission: builder.query<Permission[], void>({
      query: () => GET_LIST_PERMISSION_URL,
      providesTags: () => [{ type: 'PERMISSIONS' }],
    }),
    createNewRole: builder.mutation<Role, { name: string; permissionsName: string[] }>(
      {
        query: (queryParams) => ({
          url: ADD_NEW_ROLE_URL,
          method: 'POST',
          body: { ...queryParams },
        }),
        invalidatesTags: [{ type: 'PERMISSIONS' }, { type: 'ROLES' }],
      }
    ),
    assignRoleToUser: builder.mutation<void, { email: string; rolesName: string[] }>({
      query: (queryParams) => ({
        url: ASSIGN_ROLE_TO_USER_URL,
        method: 'PUT',
        body: { ...queryParams },
      }),
      invalidatesTags: [{ type: 'USERS' }, { type: 'ROLES' }],
    }),
    editRolePermission: builder.mutation<
      void,
      { permissionsName: string[]; roleName: string }
    >({
      query: (queryParams) => ({
        url: EDIT_ROLE_PERMISSION_URL,
        method: 'PUT',
        body: { ...queryParams },
      }),
      invalidatesTags: [{ type: 'PERMISSIONS' }, { type: 'ROLES' }],
    }),
    editPermissionRole: builder.mutation<
      void,
      { rolesName: string[]; permissionName: string }
    >({
      query: (queryParams) => ({
        url: EDIT_PERMISSION_ROLE_URL,
        method: 'PUT',
        body: { ...queryParams },
      }),
      invalidatesTags: [{ type: 'PERMISSIONS' }, { type: 'ROLES' }],
    }),
  }),
});

export const {
  useGetListPermissionQuery,
  useGetListRoleQuery,
  useEditRolePermissionMutation,
  useEditPermissionRoleMutation,
  useCreateNewRoleMutation,
  useAssignRoleToUserMutation,
} = permissionApi;
