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
      <body className={(inter.className, 'relative')}>
        {/* <GoogleAnalytics /> */}
        <div className="absolute bottom-0 left-0 right-0 z-[-2] top-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(62,62,62,0.5),transparent)]"></div>
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
