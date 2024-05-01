"use client";
import {
  Button,
  Checkbox,
  Input,
  Tooltip,
} from "@nextui-org/react";
import * as actions from "@/actions/index";
import { useFormState } from "react-dom";
import { UserIcon } from "@/icons/user-icon";
import { InformationCard } from "../information-card";
import { useState } from "react";
import { EditIcon } from "@/icons/edit-icon";
import { CancelIcon } from "@/icons/cancel-icon";
import { UserRole } from "@prisma/client";
import { InfromationIcon } from "@/icons/information-icon";

type memberData = {
  id: string;
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
  }[];
} | null;

interface EditMemberFormProps {
  memberData: memberData;
}

export const ModifyMemberAccessForm = ({ memberData }: EditMemberFormProps) => {
  const [isReadonly, setIsReadonly] = useState<boolean>(true);
  const [formState, action] = useFormState(actions.updateMemberPermissions, {
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
          {isReadonly ? "Edit permissions" : "Discard editing"}
        </Button>
        <div className="flex flex-col gap-4 w-full">
          <Input
            defaultValue={memberData?.id ? memberData.id : undefined}
            name="userId"
            label="User Id"
            type="text"
            isDisabled={isReadonly}
            variant="bordered"
            placeholder="Enter member's username"
            className="hidden"
            isInvalid={!!formState.errors.userId}
            errorMessage={formState.errors.userId?.at(0)}
            endContent={
              <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />

          {memberData?.role === UserRole.OPERATOR ||
          memberData?.role === UserRole.INSPECTOR ? (
            <>
              <Checkbox
                defaultSelected={memberData?.access[0].accessToAuthority}
                value={"accessToAuthority"}
                isDisabled={isReadonly}
                name="accessToAuthority"
                size="sm"
              >
                <div className="flex items-center">
                  <p className="pr-3">Access to authority</p>
                  <Tooltip content="I am a tooltip">
                    <InfromationIcon />
                  </Tooltip>
                </div>
              </Checkbox>
            </>
          ) : (
            ""
          )}

          <Checkbox
           defaultSelected={memberData?.access[0].accessToLogbook}
            isDisabled={isReadonly}
            size="sm"
            name="accessToLogbook"
            value={"accessToLogbook"}
          >
            <div className="flex items-center">
              <p className="pr-3">Access to Logbook</p>
            </div>
          </Checkbox>
          <Checkbox
          defaultSelected={memberData?.access[0].accessToFishing}
            isDisabled={isReadonly}
            size="sm"
            name="accessToFishing"
            value={"accessToFishing"}
          >
            <div className="flex items-center">
              <p className="pr-3">Access to Fishing</p>
            </div>
          </Checkbox>
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
          Update Permission
        </Button>
      </form>
    </>
  );
};
