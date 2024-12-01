import { siteConfig } from '@/config/siteConfig';
import './globals.css';
import Providers from './Providers';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import SessionChange from '@/components/others/session-change';
import PreviousPageTracker from '@/components/others/previousPageTracker';

// Metadata
const inter = Inter({ subsets: ['latin'] });

export const metadata = siteConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <GoogleAnalytics /> */}
        <Providers>
          <SessionChange />
          <PreviousPageTracker />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
