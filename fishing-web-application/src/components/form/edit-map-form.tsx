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
} from "@/services/queries";
import { useDebounce } from "use-debounce";
import { InformationCard } from "../information-card";

type authority = {
  id: string;
  fisheryAuthorityName: string;
};


interface NewMapFormProps {
    id: string | undefined
    center: [number,number]
    zoom: number
    fisheryAuthorityName: string | undefined
}



export const EditMapForm = ({center, zoom, fisheryAuthorityName,id}:NewMapFormProps) => {
  const [authority, setAuthority] = useState<string>("");
  const [authorityName] = useDebounce<string>(authority, 1500);
  const authorities = useAuthorities(authorityName);

  const [formState, action] = useFormState(actions.editMap, {
    errors: {},
  });

  const onAuthorityInputChange = (value: string) => {
    setAuthority(value);
  };


  return (
    <>
      <form action={action} className="space-y-3 w-full pt-3">
        <div className="flex flex-col gap-4 w-full">
        <Input
            isReadOnly
            value={id}
            name="fisheryAuthorityId"
            label="Authority ID"
            type="string"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.fisheryAuthorityId}
            errorMessage={formState.errors?.fisheryAuthorityId?.at(0)}
            placeholder="Enter the latitude"
            className="hidden"
          />
          <Autocomplete
            name="fisheryAuthorityName"
            defaultInputValue={fisheryAuthorityName}
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
        Save Editing
        </Button>
      </form>
    </>
  );
};
