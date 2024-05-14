"use client";
import { UserIcon } from "@/icons/user-icon";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useFormState } from "react-dom";
import * as actions from "@/actions/index";
import { useState } from "react";
import { useAuthorities, useFishes, useUsers } from "@/services/queries";
import { useDebounce } from "use-debounce";
import { InformationCard } from "../information-card";
import { NameTagIcon } from "@/icons/name-tag-icon";
import { EditIcon } from "@/icons/edit-icon";
import { CancelIcon } from "@/icons/cancel-icon";
import { PieceIcon } from "@/icons/piece-icon";
import { HomeIcon } from "@/icons/sidebar-icons/home-icon";
import { FishIcon } from "@/icons/sidebar-icons/fish-icon";
import { LabelIcon } from "@/icons/lable-icon";
import { FormSections } from "./form-section";

type authority = {
  id: string;
  fisheryAuthorityName: string;
};

type fish = {
    id: string;
    fishName: string;
  };

export const CreateTournamentForm = () => {
  const [authority, setAuthority] = useState<string>("");

  const [authorityName] = useDebounce<string>(authority, 1500);

  const authorities = useAuthorities(authorityName);
  const fishes = useFishes();

  const [formState, action] = useFormState(actions.createTournament, {
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
              <HomeIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
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
          <FormSections
            size="secondary"
            title="Torunament details"
            description="The following fields are required. This information is needed to determine the details, type of competition and the maximum number of participants."
          />
          <Input
            name="tournamentName"
            label="Tournament Name"
            type="text"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.tournamentName}
            errorMessage={formState.errors?.tournamentName?.at(0)}
            placeholder="Enter the tournament name"
            endContent={
              <LabelIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            name="tournamentType"
            label="Tournament Type"
            type="text"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.tournamentType}
            errorMessage={formState.errors?.tournamentType?.at(0)}
            placeholder="Enter the tournament type"
            endContent={
              <LabelIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Textarea
            name="tournamentDescription"
            label="Tournament Descripton"
            variant="bordered"
            placeholder="Enter the description of torunament"
            disableAnimation
            isRequired
            disableAutosize
            isInvalid={!!formState.errors?.tournamentDescription}
            errorMessage={formState.errors?.tournamentDescription?.at(0)}
            classNames={{
              inputWrapper: "min-h-[300px]",
              input: "min-h-[250px]",
            }}
          />
           <Input
            name="maxParticipants"
            label="Maximum number of participants"
            type="number"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.maxParticipants}
            errorMessage={formState.errors?.maxParticipants?.at(0)}
            placeholder="Enter the maximum number of participants"
            endContent={
              <PieceIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
            <FormSections
            size="secondary"
            title="Competition time limits"
            description="The following fields are required to specify the deadline for registration and the start date of the competition."
          />
          <Input
            name="startDate"
            label="Start date of tournament"
            type="date"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.startDate}
            errorMessage={formState.errors?.startDate?.at(0)}
            placeholder="Enter the start date of tournament"
          />

          <Input
            name="deadline"
            label="Deadline"
            type="date"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.deadline}
            errorMessage={formState.errors?.deadline?.at(0)}
            placeholder="Enter the deadline"
          />
            <FormSections
            size="secondary"
            title="Optional"
            description="The following field is optional, if the competition is restricted to certain fish species, please tick."
          />
           <Select
            name="fishId"
            label="Fish"
            placeholder="Select a fish type"
            variant="bordered"
            startContent={<FishIcon />}
            isInvalid={!!formState.errors?.fishId}
            errorMessage={formState.errors?.fishId?.at(0)}
          >
            {fishes.data !== undefined
              ? fishes.data.fishes.map((fish: fish) => (
                  <SelectItem key={fish.id} value={fish.fishName}>
                    {fish.fishName}
                  </SelectItem>
                ))
              : [].map((fish: fish) => {
                  return (
                    <SelectItem key={fish.id} value={fish.fishName}>
                      {fish.fishName}
                    </SelectItem>
                  );
                })}
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
        >
          Create Tournament
        </Button>
      </form>
    </>
  );
};
