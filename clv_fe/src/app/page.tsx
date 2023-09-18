import { Metadata } from 'next';
import HomePage from './Home';

export const metadata: Metadata = {
  title: 'Home - CLV Training',
  description: 'User Management & Vessel Apps',
};

export type HomeProps = {
  params: {};
  searchParams: { accessToken: string };
};

export default function Home(props: HomeProps) {
  return <HomePage {...props} />;
}
