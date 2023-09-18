import type { Metadata } from 'next';
import ProfilePage from './Profile';

export const metadata: Metadata = {
  title: 'Profile - CLV Training',
  description: 'User Profile',
};

export type ProfileProps = {
  params: {};
  searchParams: { e: string; idToken: string };
};

export default function Profile(props: ProfileProps) {
  return <ProfilePage {...props} />;
}
