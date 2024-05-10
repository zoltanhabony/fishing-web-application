"use client";

import { Button, Input, Link, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import * as actions from "@/actions/index";
import { useFormState } from "react-dom";
import { UserIcon } from "@/icons/user-icon";
import { MailIcon } from "@/icons/mail-icon";
import { EyeSlashFilledIcon } from "@/icons/eye-slash-icon";
import { EyeFilledIcon } from "@/icons/eye-icon";
import { AccountTypeIcon } from "@/icons/account-type-icon";
import { AuthCardWrapper } from "./auth-card-wrapper";
import { AppLogo } from "../brand/app-logo";

export const RegistrationForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formState, action] = useFormState(actions.credentialRegistration, {
    errors: {},
  });

  const [value, setValue] = useState<string>("user");

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <AuthCardWrapper
      welcomeText="Welcome"
      description="Create an account or login with google and start fishing"
      appLogo={<AppLogo />}
    >
      <form action={action} >
        <div className="flex flex-col gap-4 w-full">
          <Input
            name="username"
            label="Username"
            type="text"
            isRequired
            variant="bordered"
            placeholder="Enter your username"
            isInvalid={!!formState.errors.username}
            errorMessage={formState.errors.username?.at(0)}
            endContent={
              <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            name="email"
            label="Email"
            type="email"
            isRequired
            variant="bordered"
            placeholder="Enter your email"
            isInvalid={!!formState.errors.email}
            errorMessage={formState.errors.email?.at(0)}
            endContent={
              <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            name="password"
            label="Password"
            isRequired
            variant="bordered"
            placeholder="Enter your password"
            isInvalid={!!formState.errors.password}
            errorMessage={formState.errors.password?.at(0)}
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
            isRequired
            variant="bordered"
            placeholder="Confirm password"
            isInvalid={!!formState.errors.confirmPassword}
            errorMessage={formState.errors.confirmPassword?.at(0)}
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
          <Select
            label="Account Type"
            isRequired
            name="accountType"
            placeholder="Choose account type"
            selectedKeys={[value]}
            onChange={handleSelectionChange}
            isInvalid={!!formState?.errors.accountType}
            errorMessage={formState.errors.accountType?.at(0)}
            variant="bordered"
            startContent={
              <AccountTypeIcon className="text-2xl text-default-400 pointer-events-none" />
            }
          >
            <SelectItem key="user" value="user">
              User
            </SelectItem>
            <SelectItem key="operator" value="operator">
              Operator
            </SelectItem>
          </Select>
        </div>
        <div>{formState.errors._form?.join(", ")}</div>
        <Button type="submit" className="mt-4 w-full hover:bg-[#2563eb]">
          Sign Up
        </Button>
      </form>
      <div className="w-full flex flex-col justify-center items-center pb-3">
      <Link href="/auth/login" className="text-sm pt-3 text-white">{"You already have account?"}</Link>
      </div>
    </AuthCardWrapper>
  );
};
