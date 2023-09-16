import type { Metadata } from 'next';
import ProfilePage from './Profile';

export const metadata: Metadata = {
  title: 'Profile - CLV Training',
  description: 'User Profile',
};

export default function Profile() {
  return <ProfilePage />;
}
