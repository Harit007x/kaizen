'use client'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-red-400 w-full">
      Hi how are you ?
    </div>
  );
}
