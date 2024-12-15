import { AppSidebar } from '@/components/sidebar/add-sidebar';

interface PagesLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: PagesLayoutProps) {
  return (
    <main className="flex overflow-hidden p-0 w-full">
      <AppSidebar />
      {children}
    </main>
  );
}
