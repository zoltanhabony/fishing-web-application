"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation"; //külön külön kell definiálni
import { TopContent } from "./table/top-content";
import { BottomContent } from "./table/bottom-content";
import { ReusableTable } from "./table/reusable-table";
import React, { useCallback } from "react";
import { logbookRenderCell, columns } from "./table/logbook-cell";

//interface to the table (data, allDataCountInDatabase)
type logbookTableResponse = {
  id: string,
  member:{
    user:{
      name:string | null
    },
    fisheryAuthority:{
      fisheryAuthorityName: string
    }
  } | null,
  expiresDate: Date
};


interface LogbookTableProps {
  logbooks: logbookTableResponse[];
  numberOfLogbook: number;
}

export default function LogbookTable({
    logbooks,
    numberOfLogbook,
}: LogbookTableProps) {

  //Get search params for manage table
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

    const renderCell = useCallback((logbooks: logbookTableResponse, columnKey: string | number | bigint) => {
      console.log(columnKey)
      return logbookRenderCell(logbooks, columnKey);
    },[])

  //Equal in data row select in table
  const rowInQuerry = searchParams.get("row")
    ? Number(searchParams.get("row"))
    : 5;

  const pages = Math.ceil(numberOfLogbook / rowInQuerry);
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
          numberOfAuthorities={numberOfLogbook}
          router={router}
          searchParams={searchParams}
          pathname={pathname}
        />
      }
      data={logbooks}
      renderCell={renderCell}
      router={router}
      searchParams={searchParams}
      pathname={pathname}
      emptyContent="No logbook found"
    />
  );
}
