import { Metadata } from 'next';
import RegisterPage from './Register';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register new account',
};

export default function Register() {
  return <RegisterPage />;
}
