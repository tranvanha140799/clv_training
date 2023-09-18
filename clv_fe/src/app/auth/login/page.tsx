import { Metadata } from 'next';
import LoginPage from './Login';

export const metadata: Metadata = {
  title: 'Login - CLV Training',
  description: 'Login to CLV',
};

export type LoginProps = {
  params: {};
  searchParams: {};
};

export default function Login(props: LoginProps) {
  return <LoginPage {...props} />;
}
