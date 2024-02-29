import Image from "next/image";

export const AppLogo = () => {
  return (
    <Image
      className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert w-[60px]"
      src="/vercel.svg"
      alt="Next.js Logo"
      width="0"
      height="0"
      sizes="100vw"
      priority
    />
  );
};
