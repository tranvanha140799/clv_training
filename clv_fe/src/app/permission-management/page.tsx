/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { NextPage } from 'next';
import Header from '@/components/Header';
import RequireAuth from '@/components/RequireAuth';
import { Table } from 'antd';
import { useEffect } from 'react';
import { apiHooks } from '@/common/hooks';
import { customNotification } from '@/common/notification';

type ProfileProps = {};

const permissionColumns = () => [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    ellipsis: true,
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    render: (value: string) =>
      `${new Date(value).getDate()}/${new Date(value).getMonth() + 1}/${new Date(
        value
      ).getFullYear()}`,
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    render: (value: string) =>
      `${new Date(value).getDate()}/${new Date(value).getMonth() + 1}/${new Date(
        value
      ).getFullYear()}`,
  },
];

const PermissionManagement: NextPage<ProfileProps> = ({}) => {
  const {
    data: permissions,
    isLoading: isLoadingPermission,
    error: permissionError,
  } = apiHooks.useGetListPermissionQuery();
  const [
    editPermissionRole,
    { isLoading: isEditingRelation, isError, isSuccess, error: updateRelationError },
  ] = apiHooks.useEditPermissionRoleMutation();

  useEffect(() => {
    if (!isEditingRelation && isError) {
      customNotification({
        type: 'error',
        message: 'Changed Role - Permission relation failed!',
      });
    } else if (!isEditingRelation && isSuccess)
      customNotification({
        type: 'success',
        message: 'Changed Role - Permission relation successfully!',
      });
  }, [isError, isEditingRelation, isSuccess]);

  return (
    <RequireAuth>
      <Header />
      <section className="bg-ct-blueprint-600">
        <div className="max-w-full mx-auto bg-ct-dark-100 rounded-md h-[calc(100vh-5rem)] flex justify-center items-baseline">
          <div className="w-11/12">
            <p className="text-5xl font-semibold text-center">Permission Management</p>
            <div className="mt-8 flex justify-center">
              <Table
                className="w-full"
                loading={isLoadingPermission}
                dataSource={permissions}
                columns={permissionColumns()}
                rowKey="id"
                pagination={{
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} Permissions`,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </RequireAuth>
  );
};

export default PermissionManagement;
