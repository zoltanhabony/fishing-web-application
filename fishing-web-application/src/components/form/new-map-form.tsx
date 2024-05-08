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
import { useEffect, useState } from "react";
import {
  useAuthorities,
  useUsers,
} from "@/services/queries";
import { useDebounce } from "use-debounce";
import { InformationCard } from "../information-card";

type authority = {
  id: string;
  fisheryAuthorityName: string;
};

type user = {
  id: string;
  name: string | null;
};

interface NewMapFormProps {
    center: [number,number]
    zoom: number
}



export const NewMapForm = ({center, zoom}:NewMapFormProps) => {
  const [authority, setAuthority] = useState<string>("");
  const [authorityName] = useDebounce<string>(authority, 1500);
  const authorities = useAuthorities(authorityName);

  const [formState, action] = useFormState(actions.createMap, {
    errors: {},
  });

  const onAuthorityInputChange = (value: string) => {
    setAuthority(value);
  };


  return (
    <>
      <form action={action} className="space-y-3 w-full pt-3">
        <div className="flex flex-col gap-4 w-full">
          <Autocomplete
            name="fisheryAuthorityName"
            label="Authority"
            type="text"
            variant="bordered"
            isLoading={authorities.isLoading}
            isRequired={true}
            isInvalid={!!formState.errors?.fisheryAuthorityName}
            errorMessage={formState.errors?.fisheryAuthorityName?.at(0)}
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
            isReadOnly
            value={String(center[0])}
            name="lat"
            label="Location latitude"
            type="string"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.lat}
            errorMessage={formState.errors?.lat?.at(0)}
            placeholder="Enter the latitude"
          />
          <Input
          value={String(center[1])}
            isReadOnly
            name="long"
            label="Location longitude"
            type="string"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.long}
            errorMessage={formState.errors?.long?.at(0)}
            placeholder="Enter the  longitude"
            
          />
          <Input
          isReadOnly
          value={String(zoom)}
            name="zoom"
            label="Location zoom"
            type="number"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.zoom}
            errorMessage={formState.errors?.zoom?.at(0)}
            placeholder="Enter zoom value"
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
          Create Map
        </Button>
      </form>
    </>
  );
};
