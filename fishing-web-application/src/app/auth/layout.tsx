import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="h-screen flex items-center justify-center">
      <div className="w-full mobile:w-[400px] h-max-full flex flex-col items-center p-5 rounded-xl space-y-3 ">
        {children}
      </div>
    </main>
  );
}

