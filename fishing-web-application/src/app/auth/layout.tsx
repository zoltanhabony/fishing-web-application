import { BackIcon } from "@/icons/back-icon";
import { Link } from "@nextui-org/react";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen flex-col ">
      <div className="h-[70px] flex items-center px-3 py-3">
      <Link href="/" className="pl-3 text-[#969696] text-sm"><BackIcon/><span className="pl-2">back to home</span></Link>
      </div>
      <main className="h-screen flex flex-1 items-center justify-center">
      <div className="w-full mobile:w-[400px] h-max-full flex flex-col items-center p-5 rounded-xl space-y-3 ">
        {children}
      </div>
    </main>
    </div>
  );
}

