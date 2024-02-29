"use client";

import { Button, Input } from "@nextui-org/react";
import * as actions from "@/actions/index";
import { useFormState } from "react-dom";
import { MailIcon } from "@/icons/mail-icon";
import { InformationCard } from "../information-card";
import { AuthCardWrapper } from "./auth-card-wrapper";
import { AppLogo } from "../brand/app-logo"


export const PasswordResetForm = () => {
  const [formState, action] = useFormState(actions.resetPassword, { errors: {} });



  return (
    <AuthCardWrapper welcomeText="Forget your password?" description="Request a new password" appLogo={<AppLogo/>} showSocialLogin={false}>
      <form action={action}>
        <div className="flex flex-col gap-4 w-full">    
          <Input
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
        </div>
        {formState.errors?._form ? <InformationCard title={formState.errors?._form?.at(0)} subtitle={formState.errors?.subtitle} status={formState.errors?.status} description={formState.errors?.description}/> : ""}
        <Button type="submit" className="mt-4 w-full">Send password reset</Button>
      </form>
      </AuthCardWrapper>
  );
};
