import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center px-6">
      <Link
        href="/login"
        className={cn(
          'absolute right-4 top-4 md:right-8 md:top-8 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
        )}
      >
        Login
      </Link>
      <div className="mb-20 flex flex-col justify-center items-center gap-6">
        <div className="bg-black p-4 rounded-lg shadow-[0px_2px_26px_0px_rgba(255,255,255,_0.3)]">
          <img src="kaizen_logo.png" alt="Logo" className="w-8 h-8" />
        </div>
        <a
          href="https://github.com/ibelick/background-snippets"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex"
        >
          <span className="relative inline-block overflow-hidden rounded-full p-[1px]">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a9a9a9_0%,#0c0c0c_50%,#a9a9a9_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#171717_0%,#737373_50%,#171717_100%)]" />
            <div className="inline-flex h-full w-full cursor-pointer justify-center rounded-full bg-white px-3 py-1 text-xs font-medium leading-5 text-slate-600 backdrop-blur-xl dark:bg-black dark:text-slate-200">
              We are open source ⚡️
              <span className="inline-flex items-center pl-1 text-black dark:text-white">
                Github <Icons.arrowRight className="pl-0.5 text-black dark:text-white" size={16} />
              </span>
            </div>
          </span>
        </a>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-center leading-tight lg:leading-[4rem] tracking-wide">
          Organize,connect<span className="block">achieve together</span>
        </h2>

        <div className="text-sm lg:text-base font-normal text-center leading-relaxed max-w-md lg:max-w-xl tracking-wider">
          Streamline your projects with task management and team collaboration. Built with simplicity to fit seamlessly
          into your workflow.
        </div>
      </div>
    </main>
  );
}
