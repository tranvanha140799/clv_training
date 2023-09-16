import { Metadata } from 'next';
import UserManagementPage from './User';

export const metadata: Metadata = {
  title: 'User Management',
  description: '',
};

export default function User() {
  return <UserManagementPage />;
}
