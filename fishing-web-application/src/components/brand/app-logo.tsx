import Image from "next/image";


interface AppLogoProps {
  sizes?: string
}
export const AppLogo = ({sizes}: AppLogoProps) => {
  return (
    <Image
      className="relative "
      src="/app-logo.png"
      alt="Next.js Logo"
      width="32"
      height="32"
      priority
    />
  );
};
