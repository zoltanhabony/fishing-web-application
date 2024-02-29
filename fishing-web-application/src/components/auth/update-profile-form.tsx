"use client";
import { Button, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import * as actions from "@/actions/index";
import { useFormState } from "react-dom";
import { UserIcon } from "@/icons/user-icon";
import { InformationCard } from "../information-card";
import { NameTagIcon } from "@/icons/name-tag-icon";
import { useState } from "react";
import { EditIcon } from "@/icons/edit-icon";
import { CancelIcon } from "@/icons/cancel-icon";



interface UpdateProfileFormPros {
  profileData: {
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
} | null
}

export const UpdateProfileForm = ({profileData}: UpdateProfileFormPros) => {
  const { update } = useSession();
  const [isReadonly, setIsReadonly] = useState<boolean>(true);
  const [formState, action] = useFormState(actions.updateProfile, {
    errors: {},
  });
  return (
    <>
      <form action={action} className="space-y-3 w-full pt-3">
        <Button
          size="sm"
          className="hover:bg-transparent pl-1"
          color={isReadonly ? "primary" : "danger"}
          onClick={() => setIsReadonly((a) => !a)}
          variant="light"
          endContent={isReadonly ? <EditIcon /> : <CancelIcon />}
        >
          {isReadonly ? "Edit profile" : "Discard editing"}
        </Button>
        <div className="flex flex-col gap-4 w-full">
          <Input
            defaultValue={profileData?.name ? profileData.name : undefined}
            name="username"
            label="Username"
            type="text"
            isReadOnly={isReadonly}
            variant="bordered"
            placeholder="Enter your username"
            isInvalid={!!formState.errors.username}
            errorMessage={formState.errors.username?.at(0)}
            endContent={
              <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            defaultValue={profileData?.firstName ? profileData.firstName : undefined}
            name="firstName"
            isReadOnly={isReadonly}
            label="First name"
            type="text"
            variant="bordered"
            placeholder="Enter your first name"
            isInvalid={!!formState.errors.firstName}
            errorMessage={formState.errors.firstName?.at(0)}
            endContent={
              <NameTagIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            defaultValue={profileData?.lastName ? profileData.lastName: undefined}
            name="lastName"
            isReadOnly={isReadonly}
            label="Last name"
            type="text"
            variant="bordered"
            placeholder="Enter your last name"
            isInvalid={!!formState.errors.lastName}
            errorMessage={formState.errors.lastName?.at(0)}
            endContent={
              <NameTagIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
        </div>
        {formState.errors?._form ? (
          <InformationCard
            title={formState.errors?._form?.at(0)}
            subtitle={formState.errors?.subtitle}
            status={formState.errors?.status}
            description={formState.errors?.description}
          />
        ) : (
          ""
        )}
        <Button
          color="primary"
          fullWidth
          type="submit"
          onClick={() => {
            update();
          }}
          className="mt-3"
          isDisabled={isReadonly}
        >
          Update profile
        </Button>
      </form>
    </>
  );
};
