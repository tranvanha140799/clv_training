import { Metadata } from 'next';
import UserManagementPage from './User';

export const metadata: Metadata = {
  title: 'User - CLV Training',
  description: '',
};

export type UserProps = {
  params: {};
  searchParams: {};
};

export default function User(props: UserProps) {
  return (
    <UserManagementPage {...props} />
  );
}
