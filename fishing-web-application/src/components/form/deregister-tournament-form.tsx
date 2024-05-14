"use client";
import { Button, Input } from "@nextui-org/react";
import { useFormState } from "react-dom";
import * as actions from "@/actions/index";

import { InformationCard } from "../information-card";
import { PieceIcon } from "@/icons/piece-icon";
import { useSession } from "next-auth/react";

interface ApplyTournamentForm {
  id: string;
}

export const DeregisterTournamentForm = ({ id }: ApplyTournamentForm) => {
  const [formState, action] = useFormState(actions.deregisterFromTournament, {
    errors: {},
  });

  const session = useSession()

  return (
    <form action={action} className="space-y-3 w-full pt-3">
      <div className="flex flex-col gap-4 w-full">
        <Input
          defaultValue={id}
          name="id"
          label="Tournament ID"
          type="string"
          variant="bordered"
          isRequired={true}
          placeholder="Enter the tournament id"
          endContent={
            <PieceIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          className="hidden"
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
        {session.data?.user.role === "USER" || session.data?.user.role === "INSPECTOR" ? <Button color="danger" fullWidth type="submit" className="mt-3">
          Deregiser for
        </Button>: ""}
      </div>
    </form>
  );
};
