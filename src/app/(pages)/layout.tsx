import SideBar from '@/components/sidebar/add-sidebar';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen w-full p-0">
      {/* <SideBar/> */}
      {children}
    </main>
  );
}
