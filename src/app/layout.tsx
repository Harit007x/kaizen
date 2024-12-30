import './globals.css';
import { Inter } from 'next/font/google';
import SessionChange from '@/components/others/session-change';
import PreviousPageTracker from '@/components/others/previousPageTracker';
import { Toaster } from '@/components/ui/sonner';
import { siteConfig } from '@/config/siteConfig';
import Providers from './Providers';

// Metadata
const inter = Inter({ subsets: ['latin'] });

export const metadata = siteConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={(inter.className, 'relative')}>
        {/* <GoogleAnalytics /> */}
        <div className="absolute h-full w-full -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#212121_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
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
