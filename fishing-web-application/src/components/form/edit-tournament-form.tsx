"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  cn,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useFormState } from "react-dom";
import * as actions from "@/actions/index";
import { useState } from "react";
import { useAuthorities, useFishes,} from "@/services/queries";
import { useDebounce } from "use-debounce";
import { InformationCard } from "../information-card";
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

interface EditTournamentFormProps {
  props: {
    id: string,
    fisheryAuthorityName: string;
    tournamentName: string;
    tournamentType: string;
    tournamentDescription: string;
    maxParticipants: number;
    startDate: Date;
    deadline: Date;
    fishId: string | undefined;
    isFinished: boolean
  };
}

export const EditTournamentForm = ({ props }: EditTournamentFormProps) => {
  const [authority, setAuthority] = useState<string>("");

  const [authorityName] = useDebounce<string>(authority, 1500);

  const authorities = useAuthorities(authorityName);
  const fishes = useFishes();

  const [formState, action] = useFormState(actions.editTournament, {
    errors: {},
  });

  const onAuthorityInputChange = (value: string) => {
    setAuthority(value);
  };

  const deadlineYear = props.deadline.getFullYear()
  const deadlineMonth = props.deadline.getMonth().toString().length === 1 ? "0" + (props.deadline.getMonth()+1) : props.deadline.getMonth()+1
  const deadlineDay = props.deadline.getDate().toString().length === 1 ? "0" +props.deadline.getDate(): props.deadline.getDate()

  const startDateYear = props.startDate.getFullYear()
  const startDateMonth = props.startDate.getMonth().toString().length === 1 ? "0" + (props.startDate.getMonth()+1) : props.startDate.getMonth()+1
  const startDateDay = props.startDate.getDate().toString().length === 1 ? "0" +props.startDate.getDate(): props.startDate.getDate()

  return (
    <>
      <form action={action} className="space-y-3 w-full pt-3">
        <div className="flex flex-col gap-4 w-full">
        <Input
            defaultValue={props.id}
            name="id"
            label="Tournament ID"
            type="string"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.maxParticipants}
            errorMessage={formState.errors?.maxParticipants?.at(0)}
            placeholder="Enter the maximum number of participants"
            className="hidden"
            endContent={
              <PieceIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Autocomplete
            defaultInputValue={props.fisheryAuthorityName}
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
            defaultValue={props.tournamentName}
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
            defaultValue={props.tournamentType}
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
            defaultValue={props.tournamentDescription}
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
            defaultValue={props.maxParticipants.toString()}
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
            defaultValue={startDateYear+"-"+startDateMonth+"-"+startDateDay}
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
            defaultValue={deadlineYear+"-"+deadlineMonth+"-"+deadlineDay}
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
          defaultSelectedKeys={props.fishId ? [props.fishId] : undefined}
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
          <Checkbox
           defaultSelected={
              props.isFinished ? props.isFinished : undefined
            }
            value={"isFinished"}
            name="isFinished"
            classNames={{
              base: cn(
                "inline-flex w-full max-w-md bg-content1 mt-1 mb-1 ml-0",
                "items-center justify-start",
                "cursor-pointer rounded-xl hover:border-zinc-500",
                "data-[selected=true]:border-primary"
              ),
              label: "w-full",
            }}
          >
            <div>
              <h5 className="text-zinc-300 text-bold text-md">Closing of angling competition</h5>
              <p className="text-xs text-zinc-400">
              If you want to close the competition and display the competitors on the competition page, please tick this box. You can reopen the competition at any time!
              </p>
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
        <Button color="primary" fullWidth type="submit" className="mt-3">
          Update Tournament
        </Button>
      </form>
    </>
  );
};
