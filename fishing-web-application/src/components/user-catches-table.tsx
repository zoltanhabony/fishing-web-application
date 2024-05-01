"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TopContent } from "./table/top-content";
import { BottomContent } from "./table/bottom-content";
import { ReusableTable } from "./table/reusable-table";
import React, { useCallback } from "react";
import { userCatchesRenderCell, columns } from "./table/user-catches-cell";
import { Decimal } from "@prisma/client/runtime/library";
import { UserCatchesFilter } from "./form/user-catches-filter-filelds";

type catchesTableResponse = {
  id: string;
  createdAt: Date;
  isInjured: boolean | null;
  isStored: boolean;
  waterArea: {
      waterAreaCode: string;
      waterAreaName: string;
  };
  fish: {
      id: string;
      fishCode: number | null;
      fishName: string;
      fishImageURL: string;
  };
  CatchDetails: {
      value: Decimal;
      unit:{
          unitAcronyms: string
      }
  }[];
}

interface UserCatchesTableProps {
  catches: catchesTableResponse[];
  numberOfCatches: number;
}

export default function UserCatchesTable({
  catches,
  numberOfCatches,
}: UserCatchesTableProps) {
  //Get search params for manage table
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const renderCell = useCallback(
    (catches: catchesTableResponse, columnKey: React.Key) => {
      return userCatchesRenderCell(catches, columnKey);
    },
    []
  );

  //Equal in data row select in table
  const rowInQuerry = searchParams.get("row")
    ? Number(searchParams.get("row"))
    : 5;

  const pages = Math.ceil(numberOfCatches / rowInQuerry);
  //add top-bottom content with props and add array of data to table
  return (
    <ReusableTable
      columns={columns}
      bottomContent={
        <BottomContent
          pages={pages}
          router={router}
          searchParams={searchParams}
          pathname={pathname}
        />
      }
      topContent={
        <TopContent
          numberOfData={numberOfCatches}
          router={router}
          searchParams={searchParams}
          pathname={pathname}
          searchByTitle={"Search by water area"}
          buttonTitle={"Create Catch"}
          buttonIsAvailable={true}
          buttonURL={"/catch/new"}
          filterElement={<UserCatchesFilter router={router} pathname={pathname} searchParams={searchParams}/> }
        />
      }
      data={catches}
      renderCell={renderCell}
      router={router}
      searchParams={searchParams}
      pathname={pathname}
      emptyContent="No catches found"
    />
  );
}
