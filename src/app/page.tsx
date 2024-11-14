'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return <div className="w-full">Hi how are you ?</div>;
}
