import { siteConfig } from '@/config/siteConfig';
import './globals.css';
import Providers from './Providers';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/sonner';
import SessionChange from '@/components/others/session-change';

// Setup Font
const geistSans = localFont({
  src: '../../public/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: '../../public/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

// Metadata
export const metadata = siteConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* <GoogleAnalytics /> */}
        <Providers>
          <SessionChange />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
