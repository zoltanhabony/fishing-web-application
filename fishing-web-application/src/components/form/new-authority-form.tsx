"use client";
import { NameTagIcon } from "@/icons/name-tag-icon";
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
import { useCities, useWaterAreas } from "@/services/queries";
import { useDebounce } from "use-debounce";
import { InformationCard } from "../information-card";
import { FormSections } from "./form-section";

type waterArea = {
  id: string;
  waterAreaName: string;
};

type city = {
  id: string;
  cityName: string;
};


export const CreateAuthorityForm = () => {
  const [area, setArea] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const [areaName] = useDebounce<string>(area, 1500);
  const [cityName] = useDebounce<string>(city, 1500);
  
  const waterAreas = useWaterAreas(areaName);
  const cities = useCities(cityName);

  const [formState, action] = useFormState(actions.createAuthority, {
    errors: {},
  });

  const onWaterAreaInputChange = (value: string) => {
    setArea(value);
  };

  const onCityInputChange = (value: string) => {
    setCity(value);
  };



  return (
    <>
      <form action={action} className="space-y-3 w-full pt-3">
        <div className="flex flex-col gap-4 w-full">
          <Input
            defaultValue={""}
            name="authorityName"
            label="Authority Name"
            type="text"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.authorityName}
            errorMessage={formState.errors?.authorityName?.at(0)}
            placeholder="Enter your authority name"
            endContent={
              <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Autocomplete
            name="waterAreaName"
            label="Water area"
            type="text"
            variant="bordered"
            isLoading={waterAreas.isLoading}
            isRequired={true}
            isInvalid={!!formState.errors?.waterAreaName}
            errorMessage={formState.errors?.waterAreaName?.at(0)}
            placeholder="Enter the water area name"
            onInputChange={onWaterAreaInputChange}
            onKeyDown={(e: any) => {
              e.continuePropagation();
            }}
            endContent={
              <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          >
            {waterAreas.data !== undefined
              ? waterAreas.data.areas.map((area: waterArea) => {
                  return (
                    <AutocompleteItem key={area.id} value={area.id}>
                      {area.waterAreaName}
                    </AutocompleteItem>
                  );
                })
              : [].map((area: waterArea) => {
                  return (
                    <AutocompleteItem key={area.id} value={area.id}>
                      {area.waterAreaName}
                    </AutocompleteItem>
                  );
                })}
          </Autocomplete>
          <Input
            defaultValue={""}
            name="taxIdentifier"
            label="Tax identifier"
            type="string"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.taxIdentifier}
            errorMessage={formState.errors?.taxIdentifier?.at(0)}
            placeholder="Enter your authority tax id"
            description="The tax identification code consists of 11 digits and the number must be entered without hyphens"
            endContent={
              <NameTagIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <FormSections
            size="secondary"
            title="Address details"
            description="The address details are required to inform customers and to compile the catch logbook"
          />
           <Autocomplete
            name="cityName"
            label="City"
            type="text"
            variant="bordered"
            isLoading={cities.isLoading}
            isRequired={true}
            isInvalid={!!formState.errors?.cityName}
            errorMessage={formState.errors?.cityName?.at(0)}
            placeholder="Enter the city name"
            onInputChange={onCityInputChange}
            onKeyDown={(e: any) => {
              e.continuePropagation();
            }}
            endContent={
              <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          >
            {cities.data !== undefined
              ? cities.data.cities.map((city: city) => {
                  return (
                    <AutocompleteItem key={city.id} value={city.id}>
                      {city.cityName}
                    </AutocompleteItem>
                  );
                })
              : [].map((city: city) => {
                  return (
                    <AutocompleteItem key={city.id} value={city.id}>
                      {city.cityName}
                    </AutocompleteItem>
                  );
                })}
          </Autocomplete>
          <Input
            defaultValue={""}
            name="streetName"
            label="Street name"
            type="text"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.streetName}
            errorMessage={formState.errors?.streetName?.at(0)}
            placeholder="Enter the street name"
            endContent={
              <NameTagIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            defaultValue={""}
            name="streetNumber"
            label="Street number"
            type="number"
            variant="bordered"
            isRequired={true}
            placeholder="Enter the street number"
            isInvalid={!!formState.errors?.streetNumber}
            errorMessage={formState.errors?.streetNumber?.at(0)}
            endContent={
              <NameTagIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            defaultValue={""}
            name="floor"
            label="Floor number if exist"
            type="number"
            variant="bordered"
            placeholder="Enter the floor number"
            isInvalid={!!formState.errors?.floor}
            errorMessage={formState.errors?.floor?.at(0)}
            endContent={
              <NameTagIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            defaultValue={""}
            name="door"
            label="Door number if exist"
            type="number"
            variant="bordered"
            placeholder="Enter the door number"
            isInvalid={!!formState.errors?.door}
            errorMessage={formState.errors?.door?.at(0)}
            endContent={
              <NameTagIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
        </div>
        {formState.errors?._form ? <InformationCard title={formState.errors?._form?.at(0)} subtitle={formState.errors?.subtitle} status={formState.errors?.status} description={formState.errors?.description}/> : ""}
        <Button color="primary" fullWidth type="submit" className="mt-3">
          Create Authority
        </Button>
      </form>
    </>
  );
};