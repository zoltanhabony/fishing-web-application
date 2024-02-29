import { Social } from "./social";
interface AuthCardWrapperProps {
  children: React.ReactNode;
  appLogo?: React.ReactNode;
  welcomeText?: string;
  description?: string;
  redirectDescription?: string;
  redirectUrl?: string;
  showSocialLogin?: boolean;
}

export const AuthCardWrapper = ({
  appLogo,
  welcomeText,
  description,
  children,
  showSocialLogin = true
}: AuthCardWrapperProps) => {
  return (
    <>
      {appLogo}
      <div className="flex flex-col items-center pb-5 text-center">
        <h1 className="text-xl font-medium">{welcomeText}</h1>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div className="w-full">
      {children}
      </div>
      {showSocialLogin ?
      <>
      <div className="inline-flex items-center justify-center w-full">
        <hr className="w-full h-px my-3 bg-gray-200 border-0 dark:bg-[#52525b]" />
        <span className="absolute px-3 text-sm font-medium text-black -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-black">
          OR
        </span>
      </div>
       <Social/>
      </>
      : ""}
    </>
  );
};
