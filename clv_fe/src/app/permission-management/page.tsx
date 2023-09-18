import { Metadata } from 'next';
import PermissionManagementPage from './PermissionManagement';

export const metadata: Metadata = {
  title: 'Permission - CLV Training',
  description: '',
};

export type PermissionProps = {
  params: {};
  searchParams: {};
};

export default function Permission(props: PermissionProps) {
  return <PermissionManagementPage {...props} />;
}
