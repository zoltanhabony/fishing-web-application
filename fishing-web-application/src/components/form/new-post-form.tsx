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
import { useEffect, useState } from "react";
import {
  useAuthorities,
  useOwnAuthorities,
  useUsers,
} from "@/services/queries";
import { useDebounce } from "use-debounce";
import { InformationCard } from "../information-card";

type authority = {
  fisheryAuthority: {
    id: string;
    fisheryAuthorityName: string;
  };
};

type user = {
  id: string;
  name: string | null;
};

interface NewBlogFormProps {
  authorities: authority[];
  content: string;
}

export const NewPostForm = ({ authorities, content }: NewBlogFormProps) => {
  const [formState, action] = useFormState(actions.createPost, {
    errors: {},
  });

  return (
    <>
      <form action={action} className="space-y-3 w-full pt-3">
        <div className="flex flex-col gap-4 w-full">
          <Select
            name="authority"
            label="Authority"
            variant="bordered"
            placeholder="Select authority"
            required
            isInvalid={!!formState.errors?.authority}
            errorMessage={formState.errors?.authority?.at(0)}
          >
            {authorities.map((a: authority) => (
              <SelectItem key={a.fisheryAuthority.fisheryAuthorityName}>
                {a.fisheryAuthority.fisheryAuthorityName}
              </SelectItem>
            ))}
          </Select>
          <Input
            name="mainTitle"
            label="Main Title"
            type="text"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.mainTitle}
            errorMessage={formState.errors?.mainTitle?.at(0)}
            placeholder="Enter the blog main title"
          />
          <Textarea
            name="summary"
            label="Summary"
            variant="bordered"
            placeholder="Enter the short summary of post"
            disableAnimation
            isRequired
            disableAutosize
            isInvalid={!!formState.errors?.summary}
            errorMessage={formState.errors?.summary?.at(0)}
            classNames={{
              inputWrapper: "min-h-[300px]",
              input: "min-h-[250px]",
            }}
          />
          <Textarea
            isReadOnly
            value={content}
            name="content"
            label="Content"
            type="text"
            variant="bordered"
            isRequired={true}
            isInvalid={!!formState.errors?.content}
            errorMessage={formState.errors?.content?.at(0)}
            placeholder="Enter content"
            classNames={{
              inputWrapper: "min-h-[300px]",
              input: "min-h-[250px]",
            }}
            className="hidden"
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
        <br />
        <Button color="primary" fullWidth type="submit" className="mt-3">
          Create Post
        </Button>
      </form>
    </>
  );
};
