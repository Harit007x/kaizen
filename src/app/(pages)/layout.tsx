import SideBar from "@/components/add-sidebar";

interface AuthLayoutProps {
    children: React.ReactNode
  }
  
  export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <main className="min-h-screen w-full p-0 bg-blue-400">
            {/* <SideBar/> */}
            {children}
        </main>
    );
}