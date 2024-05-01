"use client";
import {
  Button,
} from "@nextui-org/react";
import { useFormState } from "react-dom";
import * as actions from "@/actions/index";

import { InformationCard } from "../information-card";






export const CreateFishingDateForm = () => {


  const [formState, action] = useFormState(actions.createFishingDate, {
    errors: {},
  });



  return (
    <>
      <form action={action} className="space-y-3 w-full pt-3">
        <div className="flex flex-col gap-4 w-full">
        {formState.errors?._form ? <InformationCard title={formState.errors?._form?.at(0)} subtitle={formState.errors?.subtitle} status={formState.errors?.status} description={formState.errors?.description}/> : ""}
        <Button color="primary" fullWidth type="submit" className="mt-3">
          Start Fishing
        </Button>
        </div>
      </form>
    </>
  );
};