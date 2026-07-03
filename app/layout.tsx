import type { Metadata } from 'next';
import './globals.css';
import { BusinessProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'DhandaAI — The Operating System for Entrepreneurship',
  description: 'From dream to launch to growth — one conversation that builds your entire business.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BusinessProvider>{children}</BusinessProvider>
      </body>
    </html>
  );
}