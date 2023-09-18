/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { NextPage } from 'next';
import Header from '@/components/Header';
import RequireAuth from '@/components/RequiredAuth';
import { Button, Modal, Select, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { apiHooks, useAppDispatch } from '@/common/hooks';
import { Permission, Role } from '@/common/types';
import { logout } from '@/redux/slices/authSlice';
import { customNotification } from '@/common/notification';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import FormInput from '@/components/FormInput';
import { LoadingButton } from '@/components/LoadingButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { TypeOf, object, string } from 'zod';
import { RoleProps } from './page';

// Schema for validating create role
const createRoleSchema = object({
  name: string()
    .min(1, 'Role name is required')
    .max(15)
    .transform((value) => value.toUpperCase()),
  // permissionsName: array(string()).nonempty(),
});

export type UpdateInput = TypeOf<typeof createRoleSchema>;

const roleColumns = (
  permissions: Permission[],
  currentRoleId: string,
  setCurrentRoleId: (name: string) => void,
  editRole: ({
    roleName,
    permissionsName,
  }: {
    roleName: string;
    permissionsName: string[];
  }) => void
) => [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Permissions',
    dataIndex: 'permissions',
    width: '20rem',
    render: (values: Permission[], record: Role) =>
      currentRoleId && currentRoleId === record.name ? (
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select Permission(s)..."
          defaultValue={
            record.permissions && record.permissions.length
              ? record.permissions.map((permission) => permission.name)
              : []
          }
          onChange={(e) => {
            editRole({ roleName: record.name, permissionsName: e });
            setCurrentRoleId('');
          }}
        >
          {permissions.length &&
            permissions.map((permission) => (
              <Select.Option key={permission.name} value={permission.name}>
                {permission.name}
              </Select.Option>
            ))}
        </Select>
      ) : values.length ? (
        values.map((permission) => (
          <Tag className="mb-1" key={permission.name}>
            {permission.name}
          </Tag>
        ))
      ) : (
        'N/A'
      ),
  },
  {
    title: 'Action',
    fixed: 'right' as const,
    render: (value: any, record: Role) => (
      <Button
        onClick={() =>
          currentRoleId && currentRoleId === record.name
            ? setCurrentRoleId('')
            : setCurrentRoleId(record.name)
        }
        type="default"
      >
        {currentRoleId && currentRoleId === record.name ? 'Cancel' : 'Edit Role'}
      </Button>
    ),
  },
];

const RoleManagementPage: NextPage<RoleProps> = ({}) => {
  const {
    data: roles,
    isLoading: isLoadingRole,
    error: roleError,
  } = apiHooks.useGetListRoleQuery();
  const { data: permissions } = apiHooks.useGetListPermissionQuery();
  const [
    createNewRole,
    { isLoading: isAddingNewRole, isSuccess, error: addNewRoleError },
  ] = apiHooks.useCreateNewRoleMutation();
  const [
    editRolePermission,
    { isLoading: isEditingRole, isLoading: isEditRoleSuccess, error: editRoleError },
  ] = apiHooks.useEditRolePermissionMutation();

  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const dispatch = useAppDispatch();

  const methods = useForm<UpdateInput>({
    resolver: zodResolver(createRoleSchema),
  });
  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useEffect(() => {
    if (
      roleError &&
      'data' in roleError &&
      typeof roleError.data === 'object' &&
      roleError.data &&
      'message' in roleError.data &&
      typeof roleError.data.message === 'string' &&
      'statusCode' in roleError.data &&
      roleError.data.statusCode
    ) {
      customNotification({ type: 'error', message: roleError.data.message });
      if (roleError.data.statusCode === 401) dispatch(logout());
    }
  }, [roleError]);

  useEffect(() => {
    if (!editRoleError && editRoleError) {
      customNotification({
        type: 'error',
        message: 'Changed user role failed!',
      });
    } else if (!editRoleError && isEditRoleSuccess)
      customNotification({
        type: 'success',
        message: 'Changed user role successfully!',
      });
  }, [editRoleError, editRoleError, isEditRoleSuccess]);

  const onSubmitHandler: SubmitHandler<UpdateInput> = async (values) => {
    try {
      const response = await createNewRole({
        ...values,
        permissionsName: selectedPermissions,
      }).unwrap();
      setIsShowModal(false);
      setSelectedPermissions([]);
      customNotification({
        type: 'success',
        message: 'Create new role successfully!',
      });
      reset();
    } catch (error: any) {
      customNotification({
        type: 'error',
        message: 'Failed!',
        description: error?.data?.message,
      });
    }
  };

  return (
    <RequireAuth>
      <Header />
      <section className="bg-ct-blueprint-600">
        <div className="max-w-full mx-auto bg-ct-dark-100 rounded-md h-[calc(100vh-5rem)] flex justify-center items-baseline">
          <div className="w-11/12">
            <p className="text-5xl font-semibold text-center">Role Management</p>
            <Button onClick={() => setIsShowModal(true)}>Create New Role</Button>
            <div className="mt-8 flex justify-center">
              <Table
                className="w-full"
                loading={isLoadingRole}
                dataSource={roles}
                columns={roleColumns(
                  permissions && permissions.length ? permissions : [],
                  currentRoleId,
                  setCurrentRoleId,
                  editRolePermission
                )}
                rowKey="name"
                pagination={{
                  pageSize: 5,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} Roles`,
                }}
              />
            </div>
          </div>
        </div>
      </section>
      <Modal
        title="Create New Role"
        open={isShowModal}
        onCancel={() => {
          setIsShowModal(false);
          setSelectedPermissions([]);
        }}
        footer={null}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
          >
            <FormInput label="Role Name" name="name" placeholder="New Role's name" />
            <>
              <label
                htmlFor="permissionsName"
                className="block text-ct-blueprint-600 mb-3"
              >
                Permissions
              </label>
              <Select
                mode="multiple"
                bordered={false}
                className="block bg-white w-full rounded-2xl appearance-none focus:outline-none py-2 px-4"
                placeholder="Choose permission(s)..."
                value={selectedPermissions}
                onChange={(e) => setSelectedPermissions(e)}
              >
                {permissions &&
                  permissions.length &&
                  permissions.map((permission) => (
                    <Select.Option key={permission.name} value={permission.name}>
                      {permission.name}
                    </Select.Option>
                  ))}
              </Select>
            </>
            <LoadingButton
              loading={isAddingNewRole}
              disabled={!selectedPermissions.length}
              textColor="text-ct-dark-100"
            >
              Confirm
            </LoadingButton>
            <button
              className="w-full py-3 font-semibold bg-ct-blueprint-600 rounded-lg outline-none border-none flex justify-center"
              onClick={() => {
                setIsShowModal(false);
                reset();
              }}
            >
              <span className="text-ct-dark-100">Cancel</span>
            </button>
          </form>
        </FormProvider>
      </Modal>
    </RequireAuth>
  );
};

export default RoleManagementPage;
