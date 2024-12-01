import { AppSidebar } from '@/components/sidebar/add-sidebar';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex overflow-hidden p-0">
      <AppSidebar />
      {children}
    </main>
  );
}
