"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TopContent } from "./table/top-content";
import { BottomContent } from "./table/bottom-content";
import { ReusableTable } from "./table/reusable-table";
import React, { useCallback } from "react";
import { catchesRenderCell, columns } from "./table/catches-cell";
import { CatchesFilter } from "./catches-filter-fields";

//interface to the table (data, allDataCountInDatabase)
type catchesTableResponse = {
  id: string;
  createdAt: Date;
  isInjured: boolean | null;
  isStored: boolean;
  waterArea: {
    waterAreaCode: string;
    waterAreaName: string;
  };
  logbook: {
    member: {
      user: {
        name: string | null;
      };
    }| null;
  };
  fish: {
    id: string;
    fishName: string;
    fishCode: number | null;
    fishImageURL: string;
  };
  CatchDetails: {
    value: any;
    unit: {
      unitAcronyms: string;
    };
  }[];
};

interface CatchesTableProps {
  catches: catchesTableResponse[];
  numberOfCatches: number;
}

export default function CatchesTable({
  catches,
  numberOfCatches,
}: CatchesTableProps) {
  //Get search params for manage table
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const renderCell = useCallback(
    (catches: catchesTableResponse, columnKey: React.Key) => {
      return catchesRenderCell(catches, columnKey);
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
          searchByTitle={"Search by username"}
          buttonTitle={""}
          buttonIsAvailable={false}
          filterElement={<CatchesFilter router={router} pathname={pathname} searchParams={searchParams}/>}
        />
      }
      data={catches}
      renderCell={renderCell}
      router={router}
      searchParams={searchParams}
      pathname={pathname}
      emptyContent="No members found"
    />
  );
}
