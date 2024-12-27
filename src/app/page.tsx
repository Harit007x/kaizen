import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui-extended/icons';

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* <nav className="fixed w-full top-0 z-50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-background bg-opacity-95 border-b border-foreground/10">
        <div className="container py-4 mx-auto flex justify-between items-center w-[90%]">
          <div className="text-lg font-semibold">Kaizen</div>
          <Link href="/login">
            <Button variant={'outline'}>Login</Button>
          </Link>
        </div>
      </nav> */}

      <nav className="fixed w-full top-8 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="text-xl font-semibold flex justify-center items-center gap-2">
            <div className="bg-black p-2 rounded-md shadow-[0px_2px_26px_0px_rgba(255,255,255,_0.2)]">
              <Image src="/kaizen_logo.png" alt="Logo" width={16} height={16} className="w-4 h-4" />{' '}
            </div>{' '}
            Kaizen
          </div>
          <Link href="/login">
            <Button variant={'outline'}>Login</Button>
          </Link>
        </div>
      </nav>

      <div className="overflow-y-auto flex-1">
        <div className="flex flex-col min-h-screen justify-center items-center gap-6 px-6 py-20">
          <div
            className="bg-black p-3 rounded-lg shadow-[0px_2px_26px_0px_rgba(255,255,255,_0.2)] animate-fade-in opacity-0"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            <Image src="/kaizen_logo.png" alt="Logo" width={36} height={36} className="w-9 h-9" />{' '}
          </div>
          <a
            href="https://github.com/ibelick/background-snippets"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <span
              className="relative inline-block overflow-hidden rounded-full p-[1px] animate-fade-in opacity-0"
              style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a9a9a9_0%,#0c0c0c_50%,#a9a9a9_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#171717_0%,#737373_50%,#171717_100%)]" />
              <div className="inline-flex h-full w-full cursor-pointer justify-center rounded-full bg-white px-3 py-1 text-xs font-medium leading-5 text-slate-600 backdrop-blur-xl dark:bg-black dark:text-slate-200">
                We are open source ⚡️
                <span className="inline-flex items-center pl-1 text-black dark:text-white">
                  Github <Icons.arrowRight className="pl-0.5 text-black dark:text-white" size={16} />
                </span>
              </div>
            </span>
          </a>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-medium text-center leading-tight lg:leading-[4rem] tracking-wide animate-fade-in opacity-0"
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            Organize, connect,<span className="block">achieve together</span>
          </h2>
          <div
            className="text-sm lg:text-base font-normal text-center leading-relaxed max-w-md lg:max-w-xl tracking-wider animate-fade-in opacity-0"
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
          >
            Streamline your projects with task management and team collaboration. Built with simplicity to fit
            seamlessly into your workflow.
          </div>
        </div>
      </div>
    </div>
  );
}
