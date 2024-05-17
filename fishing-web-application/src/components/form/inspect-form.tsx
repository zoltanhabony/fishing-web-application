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
  useAuthoritiesForLogbook,
  useCities,
  useUsers,
  useUsersForLogbook,
  useWaterAreas,
} from "@/services/queries";
import { useDebounce } from "use-debounce";
import { InformationCard } from "../information-card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type authority = {
  id: string;
  fisheryAuthorityName: string;
};

type user = {
  id: string;
  name: string | null;
};

export const InspectForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<string>("");
  const [userName] = useDebounce<string>(user, 1500);
  const [name, setName] = useState("")

  const users = useUsers(userName);

  const [formState, action] = useFormState(actions.createLogbook, {
    errors: {},
  });


  const onUserInputChange = (value: string) => {
    setUser(value);
  };

  const onSelectionChange = (key: React.Key) => {
    setName(String(key))
  };

  const params = new URLSearchParams(searchParams.toString());

  const onClick = () => {
    params.set("name", userName)
    router.replace(`${pathname}?${params.toString()}`)
  };

  return (
    <>
      <form action={action} className="space-y-3 w-full pt-3">
        <div className="flex flex-col gap-4 w-full">
          <Autocomplete
          defaultInputValue={searchParams.get("name") ? searchParams.get("name")?.toString() : "" }
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
            onSelectionChange={onSelectionChange}
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
        </div>
        <Button color="primary" fullWidth onClick={onClick} className="mt-3">
        Checking
        </Button>
      </form>
    </>
  );
};
