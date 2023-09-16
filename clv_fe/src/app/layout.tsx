import { Providers } from '@/redux/provider';
import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CLV Training',
  description: 'User Management & Vessel Apps',
  icons: { icon: '/images/icon.ico' },
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
