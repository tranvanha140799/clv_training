/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { NextPage } from 'next';
import Header from '@/components/Header';
import RequireAuth from '@/components/RequireAuth';
import { Button, Select, Switch, Table, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { apiHooks, useAppDispatch } from '@/common/hooks';
import { fetchListUser } from '@/redux/slices/userSlice';
import { Role, User } from '@/common/types';
import { logout } from '@/redux/slices/authSlice';
import { customNotification } from '@/common/notification';

type ProfileProps = {};

const columns = (
  updateUserStatus: (updateUserStatus: { email: string }) => void,
  roles: Role[],
  currentUserId: string,
  setCurrentUserId: (id: string) => void,
  assignRoleToUser: ({
    email,
    rolesName,
  }: {
    email: string;
    rolesName: string[];
  }) => void
) => [
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
  },
  {
    title: 'Office Code',
    dataIndex: 'officeCode',
    render: (value: string) => (value ? value : 'N/A'),
  },
  {
    title: 'Country',
    dataIndex: 'country',
    render: (value: string) => (value ? value : 'N/A'),
  },
  {
    title: 'Global ID',
    dataIndex: 'globalId',
    render: (value: string) => (value ? value : 'N/A'),
  },
  {
    title: 'Activated',
    dataIndex: 'isDisable',
    align: 'center' as const,
    render: (value: boolean, record: User) => (
      <Switch
        key={record.email}
        checked={!value}
        // loading={isUpdatingStatus}
        onChange={(checked, e) => {
          e.preventDefault();
          updateUserStatus({ email: record.email });
        }}
      />
    ),
  },
  {
    title: 'Roles',
    dataIndex: 'roles',
    maxWidth: '1rem',
    render: (values: Role[], record: User) =>
      currentUserId && currentUserId === record.id ? (
        <Select
          style={{ width: '100%' }}
          placeholder="Select Role..."
          defaultValue={record.roles && record.roles[0].name}
          onChange={(e) => {
            assignRoleToUser({ email: record.email, rolesName: [e] });
            setCurrentUserId('');
          }}
        >
          {roles.length &&
            roles.map((role) => (
              <Select.Option key={role.id} value={role.name}>
                {role.name}
              </Select.Option>
            ))}
        </Select>
      ) : values.length ? (
        values.map((role) => (
          <Tag
            key={role.id}
            color={
              role.name === 'USER'
                ? 'green'
                : role.name === 'ASSISTANCE'
                ? 'orange'
                : role.name === 'MODIFIER'
                ? 'volcano'
                : role.name === 'ADMIN'
                ? 'red'
                : role.name === 'MASTER'
                ? 'magenta'
                : ''
            }
          >
            {role.name}
          </Tag>
        ))
      ) : (
        'N/A'
      ),
  },
  {
    title: 'Action',
    fixed: 'right' as const,
    render: (value: any, record: User) => (
      <Button
        onClick={() =>
          currentUserId && currentUserId === record.id
            ? setCurrentUserId('')
            : setCurrentUserId(record.id)
        }
        type="default"
      >
        {currentUserId && currentUserId === record.id ? 'Cancel' : 'Edit User Role'}
      </Button>
    ),
  },
];

const UserManagement: NextPage<ProfileProps> = ({}) => {
  const [currentUserId, setCurrentUserId] = useState('');
  const { data: users, isLoading, error } = apiHooks.useGetListUsersQuery();
  const { data: roles } = apiHooks.useGetListRoleQuery();
  const [
    updateUserStatus,
    { isLoading: isUpdatingStatus, isError, isSuccess, error: updateStatusError },
  ] = apiHooks.useUpdateUserStatusMutation();
  const [
    assignRoleToUser,
    {
      isLoading: isAssigning,
      isSuccess: isAssignSuccess,
      isError: isAssignError,
      error: assignError,
    },
  ] = apiHooks.useAssignRoleToUserMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      error &&
      'data' in error &&
      typeof error.data === 'object' &&
      error.data &&
      'message' in error.data &&
      typeof error.data.message === 'string' &&
      'statusCode' in error.data &&
      error.data.statusCode
    ) {
      customNotification({
        type: 'error',
        message: error.data.message,
      });
      if (error.data.statusCode === 401) dispatch(logout());
    }
  }, [error]);

  useEffect(() => {
    if (!isUpdatingStatus && isError) {
      customNotification({
        type: 'error',
        message: 'Changed activating status failed!',
      });
    } else if (!isUpdatingStatus && isSuccess)
      customNotification({
        type: 'success',
        message: 'Changed activating status successfully!',
      });
  }, [isError, isUpdatingStatus, isSuccess]);

  useEffect(() => {
    if (!isAssigning && isAssignError) {
      customNotification({
        type: 'error',
        message: 'Changed user role failed!',
      });
    } else if (!isAssigning && isAssignSuccess)
      customNotification({
        type: 'success',
        message: 'Changed user role successfully!',
      });
  }, [isAssignError, isAssigning, isAssignSuccess]);

  useEffect(() => {
    if (users && users.length) dispatch(fetchListUser({ users }));
  }, [users]);

  return (
    <RequireAuth>
      <Header />
      <section className="bg-ct-blueprint-600">
        <div className="max-w-full mx-auto bg-ct-dark-100 rounded-md h-[calc(100vh-5rem)] flex justify-center items-baseline">
          <div className="w-11/12">
            <p className="text-5xl font-semibold text-center">User Management</p>
            <div className="mt-8 flex justify-center">
              <Table
                className="w-full"
                loading={isLoading}
                dataSource={users}
                columns={columns(
                  updateUserStatus,
                  roles && roles.length ? roles : [],
                  currentUserId,
                  setCurrentUserId,
                  assignRoleToUser
                )}
                rowKey="id"
                pagination={{
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} Users`,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </RequireAuth>
  );
};

export default UserManagement;
