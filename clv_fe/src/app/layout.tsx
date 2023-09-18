import { Providers } from '@/redux/provider';
import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = { icons: { icon: '/images/icon.ico' } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
