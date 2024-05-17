"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import * as actions from "@/actions/index";
import { useFormState } from "react-dom";
import { UserIcon } from "@/icons/user-icon";
import { InformationCard } from "../information-card";
import { NameTagIcon } from "@/icons/name-tag-icon";
import { useState } from "react";
import { EditIcon } from "@/icons/edit-icon";
import { CancelIcon } from "@/icons/cancel-icon";
import { AccountTypeIcon } from "@/icons/account-type-icon";
import { UserRole } from "@prisma/client";
import { MailIcon } from "@/icons/mail-icon";


type memberData = {
  user: {
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    role: UserRole;
    access: {
      id: string;
      userId: string;
      accessToLogbook: boolean;
      accessToAuthority: boolean;
      accessToFishing: boolean;
      accessToPost: boolean;
      accessToMarker: boolean;
      accessToTournament: boolean;
      accessToCatches: boolean;
      accessToInspect: boolean;
    }[];
  };
  id: string;
} | null;

interface EditMemberFormProps {
  memberData: memberData;
}

export const EditMemberForm = ({ memberData }: EditMemberFormProps) => {
  const [isReadonly, setIsReadonly] = useState<boolean>(true);
  const [formState, action] = useFormState(actions.updateMemberDetails, {
    errors: {},
  });

  return (
    <>
      <form action={action} className="space-y-3 w-full pt-3 pb-3">
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
            defaultValue={memberData?.id ? memberData.id : undefined}
            name="memberId"
            label="Member ID"
            type="text"
            isDisabled={isReadonly}
            variant="bordered"
            placeholder="Enter member's username"
            isInvalid={!!formState.errors.memberId}
            errorMessage={formState.errors.memberId?.at(0)}
            className="hidden"
            endContent={
              <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            defaultValue={memberData?.user.name ? memberData?.user.name : undefined}
            name="username"
            label="Username"
            type="text"
            isDisabled={isReadonly}
            variant="bordered"
            placeholder="Enter member's username"
            isInvalid={!!formState.errors.username}
            errorMessage={formState.errors.username?.at(0)}
            endContent={
              <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            defaultValue={
              memberData?.user.firstName ? memberData?.user.firstName : undefined
            }
            name="firstName"
            isDisabled={isReadonly}
            label="First name"
            type="text"
            variant="bordered"
            placeholder="Enter member's first name"
            isInvalid={!!formState.errors.firstName}
            errorMessage={formState.errors.firstName?.at(0)}
            endContent={
              <NameTagIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            defaultValue={
              memberData?.user.lastName ? memberData?.user.lastName : undefined
            }
            name="lastName"
            isDisabled={isReadonly}
            label="Last name"
            type="text"
            variant="bordered"
            placeholder="Enter member's last name"
            isInvalid={!!formState.errors.lastName}
            errorMessage={formState.errors.lastName?.at(0)}
            endContent={
              <NameTagIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            defaultValue={
              memberData?.user.email ? memberData?.user.email : undefined
            }
            name="email"
            isDisabled={isReadonly}
            label="Email"
            type="text"
            variant="bordered"
            placeholder="Enter member's email"
            isInvalid={!!formState.errors.email}
            errorMessage={formState.errors.email?.at(0)}
            endContent={
              <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Select
            isDisabled={isReadonly}
            label="User role"
            name="role"
            placeholder="Choose user role"
            defaultSelectedKeys={[String(memberData?.user.role)]}
            variant="bordered"
            isInvalid={!!formState.errors.role}
            errorMessage={formState.errors.role?.at(0)}
            startContent={
              <AccountTypeIcon className="text-2xl text-default-400 pointer-events-none" />
            }
          >
            <SelectItem key="USER" value="user">
              User
            </SelectItem>
            <SelectItem key="INSPECTOR" value="inspector">
              Inspector
            </SelectItem>
          </Select>
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
          className="mt-3"
          isDisabled={isReadonly}
        >
          Update Profile
        </Button>
      </form>
    </>
  );
};
