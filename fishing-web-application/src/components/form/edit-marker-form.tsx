"use client";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useFormState } from "react-dom";
import * as actions from "@/actions/index";
import { InformationCard } from "../information-card";
import { useMarkerTypes } from "@/services/queries";
import { MapIcon } from "@/icons/sidebar-icons/map-icon";

interface NewMapFormProps {
  center: [number, number];
  markerId: string;
  id: string;
  title: string;
  info: string;
  markerType:string;
}

type markertype = {
  id: string;
  type: string;
  markerURL: string;
};

export const EditMarkerForm = ({ center, id, title, info, markerType, markerId}: NewMapFormProps) => {
  
    const [formState, action] = useFormState(actions.editMarker, {
    errors: {},
  });

  const markerTypes = useMarkerTypes();


  return (
    <>
      <form action={action} className="space-y-3 w-full pt-3">
        <div className="flex flex-col gap-4 w-full">

        <Input
            isReadOnly
            value={id}
            name="mapId"
            label="Map ID"
            type="string"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.mapId}
            errorMessage={formState.errors?.mapId?.at(0)}
            placeholder="Enter the ID"
            className="hidden"
          />

        <Input
            isReadOnly
            value={markerId}
            name="markerId"
            label="Marker ID"
            type="string"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.markerId}
            errorMessage={formState.errors?.markerId?.at(0)}
            placeholder="Enter the ID"
            className="hidden"
          />

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
            placeholder="Enter the title"
          />

          <Select
            name="markerType"
            label="Marker Type"
            isRequired
            placeholder="Select a marker type"
            variant="bordered"
            startContent={<MapIcon />}
            isInvalid={!!formState.errors?.markerType}
            errorMessage={formState.errors?.markerType?.at(0)}
            defaultSelectedKeys={[String(markerType)]}
          >
            {markerTypes.data !== undefined
              ? markerTypes.data.markerTypes.map((type: markertype) => (
                  <SelectItem key={type.id} value={type.type}>
                    {type.type}
                  </SelectItem>
                ))
              : [].map((type: markertype) => {
                  return (
                    <SelectItem key={type.id} value={type.type}>
                      {type.type}
                    </SelectItem>
                  );
                })}
          </Select>

          <Input
            defaultValue={title}
            name="title"
            label="Marker Title"
            type="string"
            isRequired
            variant="bordered"
            isInvalid={!!formState.errors?.title}
            errorMessage={formState.errors?.title?.at(0)}
            placeholder="Enter the marker title"
          />

          <Textarea
            defaultValue={info}
            label="Description"
            name="info"
            variant="bordered"
            placeholder="Enter your description"
            disableAnimation
            isRequired
            disableAutosize
            isInvalid={!!formState.errors?.info}
            errorMessage={formState.errors?.info?.at(0)}
            classNames={{
              inputWrapper: "min-h-[300px]",
              input: "min-h-[250px]",
            }}
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
          Edit Marker
        </Button>
      </form>
    </>
  );
};
