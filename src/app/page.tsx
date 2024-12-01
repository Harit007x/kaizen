import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative flex h-screen w-screen flex-col items-center justify-center px-6">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <header></header>
      <Link
        href="/login"
        className={cn(
          'absolute right-4 top-4 md:right-8 md:top-8 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
        )}
      >
        Login
      </Link>
      <div className="mb-8 flex">
        <a
          href="https://github.com/ibelick/background-snippets"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex"
        >
          <span className="relative inline-block overflow-hidden rounded-full p-[1px]">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a9a9a9_0%,#0c0c0c_50%,#a9a9a9_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#171717_0%,#737373_50%,#171717_100%)]" />
            <div className="inline-flex h-full w-full cursor-pointer justify-center rounded-full bg-white px-3 py-1 text-xs font-medium leading-5 text-slate-600 backdrop-blur-xl dark:bg-black dark:text-slate-200">
              New snippets ⚡️
              <span className="inline-flex items-center pl-2 text-black dark:text-white">
                Read more <Icons.arrowRight className="pl-0.5 text-black dark:text-white" size={16} />
              </span>
            </div>
          </span>
        </a>
      </div>
      <div className="text-5xl font-semibold text-center leading-[3.5rem]">
        Organize,connect and <br /> achieve together
      </div>
    </main>
  );
}
