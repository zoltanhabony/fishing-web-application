"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation"; //külön külön kell definiálni
import { useCallback } from "react";
import { TopContent } from "./table/top-content";
import { BottomContent } from "./table/bottom-content";
import { ReusableTable } from "./table/reusable-table";
import { authorityRenderCell, columns } from "./table/authority-cell";
import React from "react";

//interface to the table (data, allDataCountInDatabase)
type authorityTableResponse = {
  id: string;
  fisheryAuthority: {
      id: string;
      fisheryAuthorityName: string;
      taxId: string;
      address: {
          streetName: string;
          streetNumber: number;
          floor: number | null;
          door: number | null;
          city: {
            cityName: string,
          };
      };
  };
};

interface AuthorityTableProps {
  authorities: authorityTableResponse[];
  numberOfAuthorities: number;
}

export default function AuthorityTable({
  authorities,
  numberOfAuthorities,
}: AuthorityTableProps) {


  //Get search params for manage table
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const renderCell = useCallback(
    (authorities: authorityTableResponse, columnKey: React.Key) => {
      return authorityRenderCell(authorities, columnKey);
    },
    []
  );

  //Equal in data row select in table
  const rowInQuerry = searchParams.get("row")
    ? Number(searchParams.get("row"))
    : 5;

  const pages = Math.ceil(numberOfAuthorities / rowInQuerry);
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
          numberOfData={numberOfAuthorities}
          router={router}
          searchParams={searchParams}
          pathname={pathname} searchByTitle={"Search by authority name"} buttonTitle={"Create Authority"} buttonIsAvailable={true}/>
      }
      data={authorities}
      renderCell={renderCell}
      router={router}
      searchParams={searchParams}
      pathname={pathname}
      emptyContent="No authories found"
    />
  );
}
