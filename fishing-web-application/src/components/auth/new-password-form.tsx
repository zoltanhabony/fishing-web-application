"use client";

import { Button, Input } from "@nextui-org/react";
import * as actions from "@/actions/index";
import { useFormState } from "react-dom";
import { InformationCard } from "../information-card";
import { AuthCardWrapper } from "./auth-card-wrapper";
import { AppLogo } from "../brand/app-logo"
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { EyeSlashFilledIcon } from "@/icons/eye-slash-icon";
import { EyeFilledIcon } from "@/icons/eye-icon";


export const NewPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
  
    const [isVisible, setIsVisible] = useState(false);
    const [formState, action] = useFormState(actions.newPassword, { errors: {} });
  
    const toggleVisibility = () => setIsVisible(!isVisible); 


  return (
    <AuthCardWrapper welcomeText="Change your password" description="Change your password" appLogo={<AppLogo/>} showSocialLogin={false}>
      <form action={action}>
        <div className="flex flex-col gap-4 w-full">    
        <Input
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
          <Input
            name="confirmPassword"
            label="Confirm password"
            variant="bordered"
            placeholder="Confirm password"
            isInvalid={!!formState.errors?.confirmPassword}
            errorMessage={formState.errors?.confirmPassword?.at(0)}
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
          <Input
            isReadOnly
            name="token"
            type="text"
            label="token"
            variant="bordered"
            defaultValue={token ? token : ""}
            className="hidden"
          />
        </div>
        {formState.errors?._form ? <InformationCard title={formState.errors?._form?.at(0)} subtitle={formState.errors?.subtitle} status={formState.errors?.status} description={formState.errors?.description}/> : ""}
        <Button type="submit" className="mt-4 w-full">Change password</Button>
      </form>
      </AuthCardWrapper>
  );
};
