"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";

interface FilterElementProps {
  router: AppRouterInstance;
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
}

export const UserCatchesFilter = ({
  router,
  pathname,
  searchParams,
}: FilterElementProps) => {
  const params = new URLSearchParams(searchParams);
  return (
    <div>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Select
        selectedKeys={searchParams.get("isSaved") ? [String(searchParams.get("isSaved"))] : ["false"]}
          size="sm"
          label="Select type of save filter"
          className="max-w-xs"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            params.set("isSaved", "" + e.target.value);
            params.set("page", "1");
            router.replace(`${pathname}?${params.toString()}`);
          }}
        >
          <SelectItem key={"false"}>All</SelectItem>
          <SelectItem key={"true"}>Saved</SelectItem>
        </Select>
      </div>
    </div>
  );
};
