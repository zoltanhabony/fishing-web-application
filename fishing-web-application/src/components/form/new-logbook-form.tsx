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
import { useAuthorities, useAuthoritiesForLogbook, useCities, useUsersForLogbook, useWaterAreas } from "@/services/queries";
import { useDebounce } from "use-debounce";
import { InformationCard } from "../information-card";

type authority = {
    id: string,
    fisheryAuthorityName:  string,
}

type user = {
    id: string,
    name:  string | null,
}

export const CreateLogbookForm = () => {
  const [authority, setAuthority] = useState<string>("");
  const [user, setUser] = useState<string>("");

  const [authorityName] = useDebounce<string>(authority, 1500);
  const [userName] = useDebounce<string>(user, 1500);
  
  const authorities = useAuthoritiesForLogbook(authorityName);
  const users = useUsersForLogbook(userName);

  const [formState, action] = useFormState(actions.createLogbook, {
    errors: {},
  });

  const onAuthorityInputChange = (value: string) => {
    setAuthority(value);
  };

  const onUserInputChange = (value: string) => {
    setUser(value);
  };



  return (
    <>
      <form action={action} className="space-y-3 w-full pt-3">
        <div className="flex flex-col gap-4 w-full">
        <Autocomplete
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
        </div>
        {formState.errors?._form ? <InformationCard title={formState.errors?._form?.at(0)} subtitle={formState.errors?.subtitle} status={formState.errors?.status} description={formState.errors?.description}/> : ""}
        <Button color="primary" fullWidth type="submit" className="mt-3">
          Create Logbook
        </Button>
      </form>
    </>
  );
};