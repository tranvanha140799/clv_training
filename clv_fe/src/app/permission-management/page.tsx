import { Metadata } from 'next';
import PermissionManagementPage from './PermissionManagement';

export const metadata: Metadata = {
  title: 'Permission Management',
  description: '',
};

export default function Permission() {
  return <PermissionManagementPage />;
}
