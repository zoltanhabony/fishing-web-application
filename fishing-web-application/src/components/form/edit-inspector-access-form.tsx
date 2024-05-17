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

export const ModifyInspectorAccessForm = ({ memberData }: EditMemberFormProps) => {
  const [isReadonly, setIsReadonly] = useState<boolean>(true);
  const [formState, action] = useFormState(actions.updateInspectorPermissions, {
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
            name="memberId"
            label="Member ID"
            type="text"
            isDisabled={isReadonly}
            variant="bordered"
            placeholder="Enter member's ID"
            className="hidden"
            isInvalid={!!formState.errors.memberId}
            errorMessage={formState.errors.memberId?.at(0)}
            endContent={
              <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />

          <Checkbox
           defaultSelected={memberData?.user.access[0].accessToLogbook}
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
          defaultSelected={memberData?.user.access[0].accessToFishing}
            isDisabled={isReadonly}
            size="sm"
            name="accessToFishing"
            value={"accessToFishing"}
          >
            <div className="flex items-center">
              <p className="pr-3">Access to Fishing</p>
            </div>
          </Checkbox>

          <Checkbox
          defaultSelected={memberData?.user.access[0].accessToAuthority}
            isDisabled={isReadonly}
            size="sm"
            name="accessToAuthority"
            value={"accessToAuthority"}
          >
            <div className="flex items-center">
              <p className="pr-3">Access to Authority</p>
            </div>
          </Checkbox>

          <Checkbox
          defaultSelected={memberData?.user.access[0].accessToCatches}
            isDisabled={isReadonly}
            size="sm"
            name="accessToCatch"
            value={"accessToCatches"}
          >
            <div className="flex items-center">
              <p className="pr-3">Access to Catches</p>
            </div>
          </Checkbox>

          <Checkbox
          defaultSelected={memberData?.user.access[0].accessToInspect}
            isDisabled={isReadonly}
            size="sm"
            name="accessToInspect"
            value={"accessToInspect"}
          >
            <div className="flex items-center">
              <p className="pr-3">Access to Inspect</p>
            </div>
          </Checkbox>

          <Checkbox
          defaultSelected={memberData?.user.access[0].accessToPost}
            isDisabled={isReadonly}
            size="sm"
            name="accessToPost"
            value={"accessToPost"}
          >
            <div className="flex items-center">
              <p className="pr-3">Access to Post</p>
            </div>
          </Checkbox>

          <Checkbox
          defaultSelected={memberData?.user.access[0].accessToTournament}
            isDisabled={isReadonly}
            size="sm"
            name="accessToTournament"
            value={"accessToTournament"}
          >
            <div className="flex items-center">
              <p className="pr-3">Access to Tournament</p>
            </div>
          </Checkbox>

          <Checkbox
          defaultSelected={memberData?.user.access[0].accessToMarker}
            isDisabled={isReadonly}
            size="sm"
            name="accessToMarker"
            value={"accessToMarker"}
          >
            <div className="flex items-center">
              <p className="pr-3">Access to Marker</p>
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
