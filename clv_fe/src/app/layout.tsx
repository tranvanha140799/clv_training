import { Providers } from '@/redux/provider';
import './globals.css';

export const metadata = {
  title: 'CLV Training',
  description: 'User Management & Vessel Apps',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
