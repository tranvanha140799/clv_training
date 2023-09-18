import { Metadata } from 'next';
import RoleManagementPage from './Role';

export const metadata: Metadata = {
  title: 'Role - CLV Training',
  description: '',
};

export type RoleProps = {
  params: {};
  searchParams: {};
};

export default function Role(props: RoleProps) {
  return <RoleManagementPage {...props} />;
}
