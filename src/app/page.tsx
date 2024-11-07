'use client'
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Button onClick={() => router.push('/sign-in')}>Sign In</Button>
      <Button onClick={() => router.push('/sign-up')}>Sign Up</Button>
      <Button onClick={() => router.push('/test')}>Test</Button>
      <br/>
      <Button 
          onClick={() => signOut({ callbackUrl: "/sign-in" })}
      >Logout</Button>
    </div>
  );
}
