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
} from "@nextui-org/react";
import { useFormState } from "react-dom";
import * as actions from "@/actions/index";
import { useFishes, useUnits, useWaterAreas } from "@/services/queries";
import { InformationCard } from "../information-card";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { FormSections } from "./form-section";
import { WaterAreaIcon } from "@/icons/water-area-icon";
import { FishIcon } from "@/icons/sidebar-icons/fish-icon";
import { WeightIcon } from "@/icons/weight-icon";
import { LengthIcon } from "@/icons/length-icon";
import { PieceIcon } from "@/icons/piece-icon";

type fish = {
  id: string;
  fishName: string;
};

type waterArea = {
  id: string;
  waterAreaName: string;
};

type unit = {
  id: string;
  unitName: string;
  unitAcronyms: string;
};

export const CreateCatchForm = () => {
  const [formState, action] = useFormState(actions.createCatch, {
    errors: {},
  });

  const fishes = useFishes();

  const weightUnit = useUnits("MASS");

  const lengthUnit = useUnits("LENGTH");

  const pieceUnit = useUnits("PIECE");

  const [area, setArea] = useState<string>("");
  const [areaName] = useDebounce<string>(area, 1500);
  const waterAreas = useWaterAreas(areaName);
  const onWaterAreaInputChange = (value: string) => {
    setArea(value);
  };

  return (
    <>
      <form action={action} className="space-y-3 w-full pt-3">
        <div className="flex flex-col gap-4 w-full">
          <Autocomplete
            name="waterAreaName"
            label="Water area"
            type="text"
            isRequired
            variant="bordered"
            isLoading={waterAreas.isLoading}
            isInvalid={!!formState.errors?.waterAreaName}
            errorMessage={formState.errors?.waterAreaName?.at(0)}
            placeholder="Enter the water area name"
            onInputChange={onWaterAreaInputChange}
            onKeyDown={(e: any) => {
              e.continuePropagation();
            }}
            endContent={
              <WaterAreaIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
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
          <FormSections
            size="secondary"
            title="About Fish"
            description="The following fields are required. These data will be necessary to describes the characteristics and health of the fish"
          />

          <Select
            name="fishId"
            label="Fish"
            isRequired
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
            value={"isInjured"}
            name="isInjured"
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
              <h5 className="text-zinc-300 text-bold text-md">Injured fish!</h5>
              <p className="text-xs text-zinc-400">
                If the fish has an injury not caused by fishing please tick this
                box! Also tick this box if the fish shows signs of disease,
                helping to protect the environment and fish stocks
              </p>
            </div>
          </Checkbox>

          <FormSections
            size="third"
            title="Specify Dimensions"
            description="By law, the fish can be presented in two different ways. There are fish that must be given by piece and fish that must be given by weight. Fill in the correct field according to the fish you have chosen."
          />

          <h5 className="text-zinc-300 font-semibold text-xs">Weight</h5>
          <div className="w-full space-y-4 sm:flex sm:space-x-3 sm:space-y-0">
            <Input
              defaultValue={""}
              name="weight"
              label="Weight"
              type="number"
              variant="bordered"
              placeholder="Enter the weight"
              isInvalid={!!formState.errors?.weight}
              errorMessage={formState.errors?.weight?.at(0)}
              endContent={
                <WeightIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
            />

            <Select
              label="Unit"
              name="weightUnit"
              placeholder="Select a unit type"
              variant="bordered"
              isInvalid={!!formState.errors?.weightUnit}
              errorMessage={formState.errors?.weightUnit?.at(0)}
            >
              {weightUnit.data !== undefined
                ? weightUnit.data.units.map((unit: unit) => (
                    <SelectItem key={unit.id} value={unit.unitName}>
                      {unit.unitAcronyms + " - " + unit.unitName}
                    </SelectItem>
                  ))
                : [].map((unit: unit) => {
                    return (
                      <SelectItem key={unit.id} value={unit.unitName}>
                        {unit.unitAcronyms + " - " + unit.unitName}
                      </SelectItem>
                    );
                  })}
            </Select>
          </div>

          <h5 className="text-zinc-300 font-semibold text-xs">Length</h5>

          <div className="w-full space-y-4 sm:flex sm:space-x-3 sm:space-y-0">
            <Input
              defaultValue={""}
              name="length"
              label="Length"
              type="number"
              variant="bordered"
              placeholder="Enter the length"
              isInvalid={!!formState.errors?.length}
              errorMessage={formState.errors?.length?.at(0)}
              endContent={
                <LengthIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
            />

            <Select
              name="lengthUnit"
              label="Unit"
              placeholder="Select a unit type"
              variant="bordered"
              isInvalid={!!formState.errors?.lengthUnit}
              errorMessage={formState.errors?.lengthUnit?.at(0)}
            >
              {lengthUnit.data !== undefined
                ? lengthUnit.data.units.map((unit: unit) => (
                    <SelectItem key={unit.id} value={unit.unitName}>
                      {unit.unitAcronyms + " - " + unit.unitName}
                    </SelectItem>
                  ))
                : [].map((unit: unit) => {
                    return (
                      <SelectItem key={unit.id} value={unit.unitName}>
                        {unit.unitAcronyms + " - " + unit.unitName}
                      </SelectItem>
                    );
                  })}
            </Select>
          </div>

          <h5 className="text-zinc-300 font-semibold text-xs">Piece</h5>

          <div className="w-full space-y-4 sm:flex sm:space-x-3 sm:space-y-0">
            <Input
              defaultValue={""}
              name="piece"
              label="Piece"
              type="number"
              variant="bordered"
              placeholder="Enter the piece"
              isInvalid={!!formState.errors?.piece}
              errorMessage={formState.errors?.piece?.at(0)}
              endContent={
                <PieceIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
            />

            <Select
              name="pieceUnit"
              label="Unit"
              placeholder="Select a unit type"
              variant="bordered"
              isInvalid={!!formState.errors?.pieceUnit}
              errorMessage={formState.errors?.pieceUnit?.at(0)}
            >
              {pieceUnit.data !== undefined
                ? pieceUnit.data.units.map((unit: unit) => (
                    <SelectItem key={unit.id} value={unit.unitName}>
                      {unit.unitAcronyms + " - " + unit.unitName}
                    </SelectItem>
                  ))
                : [].map((unit: unit) => {
                    return (
                      <SelectItem key={unit.id} value={unit.unitName}>
                        {unit.unitAcronyms + " - " + unit.unitName}
                      </SelectItem>
                    );
                  })}
            </Select>
          </div>
          <FormSections
            size="third"
            title="Optional, provide additional information"
            description="The following information is optional, but you can specify the characteristics of the fish caught, the conditions and the methods used if you wish!"
          />

          <Checkbox
            name="isStored"
            value={"isStored"}
            classNames={{
              base: cn(
                "inline-flex w-full max-w-md bg-content1  mt-1 mb-1 ml-0",
                "items-center justify-start",
                "cursor-pointer rounded-xl hover:border-zinc-500",
                "data-[selected=true]:border-primary"
              ),
              label: "w-full",
            }}
          >
            <div>
              <h5 className="text-zinc-300 text-bold text-md">
                Before you save!
              </h5>
              <p className="text-xs text-zinc-400">
                If you want to save the fish to the catch logbook and keep and
                take it away, tick the box. If you only want to make a simple
                save, ignore
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
          Create Catch
        </Button>
      </form>
    </>
  );
};
