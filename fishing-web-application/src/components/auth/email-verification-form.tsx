"use client";

import { useSearchParams } from "next/navigation";
import * as actions from "@/actions/index";
import { Button, Input, Link } from "@nextui-org/react";
import { useFormState } from "react-dom";
import { TokenIcon } from "@/icons/token-icon";
import { InformationCard } from "../information-card";
import { AuthCardWrapper } from "./auth-card-wrapper";
import { AppLogo } from "../brand/app-logo";

export const EmailVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formState, action] = useFormState(actions.verifyEmail, {
    errors: {},
  });

  return (
    <AuthCardWrapper
      welcomeText="Welcome"
      description="Verify your email and start fishing!"
      appLogo={<AppLogo />
    }
    showSocialLogin={false}
    >
      {formState.errors?._form ? (
        <div className="w-full flex items-center flex-col">
          <InformationCard
            title={formState.errors?._form?.at(0)}
            subtitle={formState.errors?.subtitle}
            status={formState.errors?.status}
            description={formState.errors?.description}
          />
          <Link className="pt-3 text-sm" href="/auth/login">
            Back to login
          </Link>
        </div>
      ) : (
        ""
      )}
      <form action={action} className="w-full space-y-3">
        <Input
          className="pb-3 hidden"
          name="token"
          label="Token"
          value={token ? token : ""}
          type="text"
          variant="bordered"
          readOnly
          placeholder="a5Fcx78Kbrfk9iol4ck"
          endContent={
            <TokenIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
        />
        {formState.errors?._form ? (
          ""
        ) : (
          <Button type="submit" fullWidth>
            Verify email
          </Button>
        )}
      </form>
    </AuthCardWrapper>
  );
};
