import { Metadata } from 'next';
import RoleManagementPage from './Role';

export const metadata: Metadata = {
  title: 'Role Management',
  description: '',
};

export default function Role() {
  return <RoleManagementPage />;
}
