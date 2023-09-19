/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { NextPage } from 'next';
import { Table } from 'antd';
import { useEffect } from 'react';
import {
  useGetListPermissionQuery,
  useEditPermissionRoleMutation,
} from '@/common/hooks';
import { customNotification } from '@/common/notification';
import { Container, RequireAuth } from '@/components';
import { PermissionProps } from './page';

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
];

const PermissionManagementPage: NextPage<PermissionProps> = ({}) => {
  const {
    data: permissions,
    isLoading: isLoadingPermission,
    error: permissionError,
  } = useGetListPermissionQuery();
  const [
    editPermissionRole,
    { isLoading: isEditingRelation, isError, isSuccess, error: updateRelationError },
  ] = useEditPermissionRoleMutation();

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
      <Container>
        <div className="w-11/12">
          <p className="text-5xl font-semibold text-center">Permission Management</p>
          <div className="mt-8 flex justify-center">
            <Table
              className="w-full"
              loading={isLoadingPermission}
              dataSource={permissions}
              columns={permissionColumns()}
              rowKey="name"
              pagination={{
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} Permissions`,
              }}
            />
          </div>
        </div>
      </Container>
    </RequireAuth>
  );
};

export default PermissionManagementPage;
