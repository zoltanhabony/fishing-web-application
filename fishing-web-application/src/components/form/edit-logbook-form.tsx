"use client";
import { UserIcon } from "@/icons/user-icon";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import { useFormState } from "react-dom";
import * as actions from "@/actions/index";
import { useState } from "react";
import {
  useAuthorities,
  useUsers,
} from "@/services/queries";
import { useDebounce } from "use-debounce";
import { InformationCard } from "../information-card";
import { NameTagIcon } from "@/icons/name-tag-icon";

type authority = {
  id: string;
  fisheryAuthorityName: string;
};

type user = {
  id: string;
  name: string | null;
};

interface EditLogbookFormProps {
  data: logbookData;
}

type logbookData = {
  id: string;
  expiresDate: Date;
  member: {
    user: {
      id: string;
      name: string | null;
    };
    fisheryAuthority: {
      id: string;
      fisheryAuthorityName: string;
    };
  } | null;
};

export const EditLogbookForm = (data: EditLogbookFormProps) => {
  const [authority, setAuthority] = useState<string>("");
  const [user, setUser] = useState<string>("");

  const [authorityName] = useDebounce<string>(authority, 1500);
  const [userName] = useDebounce<string>(user, 1500);

  const authorities = useAuthorities(authorityName);
  const users = useUsers(userName);

  const [formState, action] = useFormState(actions.modifyLogbook, {
    errors: {},
  });

  const onAuthorityInputChange = (value: string) => {
    setAuthority(value);
  };

  const onUserInputChange = (value: string) => {
    setUser(value);
  };

  const year = data.data.expiresDate.getFullYear()
  const month = data.data.expiresDate.getMonth().toString().length === 1 ? "0" + (data.data.expiresDate.getMonth()+1) : data.data.expiresDate.getMonth()+1
  const day = data.data.expiresDate.getDate().toString().length === 1 ? "0" + data.data.expiresDate.getDate(): data.data.expiresDate.getDate()

  console.log(year+"-"+month+"-"+day)

  return (
    <>
      <form action={action} className="space-y-3 w-full pt-3">
        <div className="flex flex-col gap-4 w-full">
          <Autocomplete
            defaultInputValue={data.data.member?.user.name ? data.data.member?.user.name : ""}
            name="userName"
            label="User"
            type="text"
            variant="bordered"
            isLoading={users.isLoading}
            isRequired={true}
            isInvalid={!!formState.errors?.userName}
            errorMessage={formState.errors?.userName?.at(0)}
            placeholder="Enter the username"
            onInputChange={onUserInputChange}
            onKeyDown={(e: any) => {
              e.continuePropagation();
            }}
            endContent={
              <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          >
            {users.data !== undefined
              ? users.data.users.map((user: user) => {
                  return (
                    <AutocompleteItem key={user.id} value={user.id}>
                      {user.name}
                    </AutocompleteItem>
                  );
                })
              : [].map((user: user) => {
                  return (
                    <AutocompleteItem key={user.id} value={user.id}>
                      {user.name}
                    </AutocompleteItem>
                  );
                })}
          </Autocomplete>
          <Autocomplete
          defaultInputValue={data.data.member?.fisheryAuthority.fisheryAuthorityName}
            name="fisheryAuthorityName"
            label="Authority"
            type="text"
            variant="bordered"
            isLoading={authorities.isLoading}
            isRequired={true}
            isInvalid={!!formState.errors?.authorityName}
            errorMessage={formState.errors?.authorityName?.at(0)}
            placeholder="Enter the fishery authority name"
            onInputChange={onAuthorityInputChange}
            onKeyDown={(e: any) => {
              e.continuePropagation();
            }}
            endContent={
              <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          >
            {authorities.data !== undefined
              ? authorities.data.authorities.map((authority: authority) => {
                  return (
                    <AutocompleteItem key={authority.id} value={authority.id}>
                      {authority.fisheryAuthorityName}
                    </AutocompleteItem>
                  );
                })
              : [].map((authority: authority) => {
                  return (
                    <AutocompleteItem key={authority.id} value={authority.id}>
                      {authority.fisheryAuthorityName}
                    </AutocompleteItem>
                  );
                })}
          </Autocomplete>
          <Input
            defaultValue={year+"-"+month+"-"+day}
            name="expiresDate"
            label="Expires Date"
            type="date"
            variant="bordered"
            isRequired={true}
            isInvalid={false}
            errorMessage={formState.errors?.expiresDate?.at(0)}
            placeholder="Enter the expires date"
            endContent={
              <NameTagIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            defaultValue={data.data.id}
            name="id"
            label="Id"
            type="text"
            variant="bordered"
            className="hidden"
            isRequired={true}
            isInvalid={false}
            errorMessage={formState.errors?.expiresDate?.at(0)}
            placeholder="Enter the logbook id"
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
        <Button color="primary" fullWidth type="submit" className="mt-3">
          Create Logbook
        </Button>
      </form>
    </>
  );
};
