import { Metadata } from 'next';

import './globals.css';

import { Inter } from 'next/font/google';

import { Providers } from '@/lib/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `Mood Creature - Sensory Check-In`,
  description: `A neurodivergent-friendly mood tracking companion with sensory metaphors`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
