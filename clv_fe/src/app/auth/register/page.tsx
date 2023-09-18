import { Metadata } from 'next';
import RegisterPage from './Register';

export const metadata: Metadata = {
  title: 'Register - CLV Training',
  description: 'Register new account',
};

export type RegisterProps = {
  params: {};
  searchParams: {};
};

export default function Register(props: RegisterProps) {
  return <RegisterPage {...props} />;
}
