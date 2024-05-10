"use client";

import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import * as actions from "@/actions/index";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MailIcon } from "@/icons/mail-icon";
import { EyeSlashFilledIcon } from "@/icons/eye-slash-icon";
import { EyeFilledIcon } from "@/icons/eye-icon";
import { TwoFactorIcon } from "@/icons/2fa-icon";
import { InformationCard } from "../information-card";
import { AuthCardWrapper } from "./auth-card-wrapper";
import { AppLogo } from "../brand/app-logo"


export const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formState, action] = useFormState(actions.credentialLogin, {
    errors: {},
  });
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email is already use with different provider"
      : "";

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <AuthCardWrapper welcomeText="Welcome" description="Login your account and start fishing" appLogo={<AppLogo/>}>
      <form action={action}>
        <div className="flex flex-col gap-4 w-full">
          <Input
            className={formState.errors?.twoFactor ? "block" : "hidden"}
            name="code"
            label="Two factor code"
            type="text"
            variant="bordered"
            placeholder="123456"
            isInvalid={!!formState.errors?.code}
            errorMessage={formState.errors?.code?.at(0)}
            endContent={
              <TwoFactorIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />

          <Input
            className={formState.errors?.twoFactor ? "hidden" : "block"}
            isRequired
            name="email"
            label="Email"
            type="email"
            variant="bordered"
            placeholder="Enter your email"
            isInvalid={!!formState.errors?.email}
            errorMessage={formState.errors?.email?.at(0)}
            endContent={
              <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            isRequired
            className={formState.errors?.twoFactor ? "hidden" : "block"}
            name="password"
            label="Password"
            variant="bordered"
            placeholder="Enter your password"
            isInvalid={!!formState.errors?.password}
            errorMessage={formState.errors?.password?.at(0)}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />
          <Link href="/auth/reset" className="px-0 font-normal text-xs">
            Forgot password?
          </Link>
        </div>
        
        {formState.errors?._form ? <InformationCard title={formState.errors?._form?.at(0)} subtitle={formState.errors?.subtitle} status={formState.errors?.status} description={formState.errors?.description}/> : ""}
        
        <div>{urlError ? <InformationCard title="Email is already use!" subtitle={urlError} status="error" description={urlError + ", try to login with credentials or try to reset password!"}/> : ""}</div>
        <Button type="submit" className="mt-4 w-full">
          {formState.errors?.twoFactor ? "Confirm" : "Login"}
        </Button>
      </form>
      <div className="w-full flex flex-col justify-center items-center pb-3">
      <Link href="/auth/registration" className="text-sm pt-3 text-white">{"You don't have account?"}</Link>
      </div>
      </AuthCardWrapper> 
  );
};
