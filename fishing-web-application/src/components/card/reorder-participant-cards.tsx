"use client";

import { Avatar, Button, Card, CardBody, Input } from "@nextui-org/react";

import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import { ParticipantCardEditable } from "./participant-card-editable";
import { PieceIcon } from "@/icons/piece-icon";
import { useFormState } from "react-dom";
import * as actions from "@/actions/index";
import { InformationCard } from "../information-card";

interface ReorderParticipantCardsProps {
  tournamentId:string,
  items: {
    id:string
    member: {
      id: string;
      user: {
        image: string | null;
        name: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
      };
    };
  }[];
}


export const ReorderParticipantCards = ({
  items, tournamentId
}: ReorderParticipantCardsProps) => {
  const [values, setValues] = useState(items);

  const [formState, action] = useFormState(actions.changeRank,{
    errors: {},
  });
  return (
    <div className="w-full">
      <Reorder.Group
        values={values}
        onReorder={setValues}
        className="space-y-5"
      >
        {values.map((value, index) => (
          <Reorder.Item key={value.member.id} value={value}>
            <ParticipantCardEditable 
              key={value.member.id}
              item={value}
              index={index + 1}
              tournamentId={tournamentId}
              setState={setValues}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      {items.length === 0 ? <p className="text-sm ">No member has applied yet</p> :
      <form action={action}>
      <Input
            defaultValue={tournamentId}
            name="tournamentId"
            label="Tournament ID"
            type="string"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.tournamentId}
            errorMessage={formState.errors?.tournamentId?.at(0)}
            placeholder="Enter the maximum number of participants"
            className="hidden"
            endContent={
              <PieceIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Input
            value={JSON.stringify(values)}
            name="ranks"
            label="Ranks"
            type="string"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.tournamentId}
            errorMessage={formState.errors?.tournamentId?.at(0)}
            placeholder="Enter the ranks array"
            className="hidden"
            endContent={
              <PieceIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
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
      <Button className="mt-5" color="primary" fullWidth type="submit">Change Order</Button>
      </form>
      }
    </div>
  );
};
