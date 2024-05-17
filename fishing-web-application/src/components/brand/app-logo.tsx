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
      width="36"
      height="36"
      priority
    />
  );
};
