import { Metadata } from 'next';
import LoginPage from './Login';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to CLV',
};

export default function Login() {
  return <LoginPage />;
}
