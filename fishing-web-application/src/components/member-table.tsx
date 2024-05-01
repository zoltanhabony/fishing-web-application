"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation"; //külön külön kell definiálni
import { TopContent } from "./table/top-content";
import { BottomContent } from "./table/bottom-content";
import { ReusableTable } from "./table/reusable-table";
import React, { useCallback } from "react";
import { memberRenderCell, columns } from "./table/member-cell";
import { UserRole } from "@prisma/client";

//interface to the table (data, allDataCountInDatabase)
type memberTableResponse = {
  id: string,
  user: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
    role: UserRole;
  };
  fisheryAuthority: {
    id: string;
    fisheryAuthorityName: string;
  };
  logBook: {
    id: string;
    expiresDate: Date;
  }| null;
};

interface MemberTableProps {
  members: memberTableResponse[];
  numberOfMembers: number;
}

export default function MembersTable({
  members,
  numberOfMembers,
}: MemberTableProps) {
  //Get search params for manage table
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
 
  const renderCell = useCallback(
    (members: memberTableResponse, columnKey: React.Key) => {
      return memberRenderCell(members, columnKey);
    },
    []
  );


  //Equal in data row select in table
  const rowInQuerry = searchParams.get("row")
    ? Number(searchParams.get("row"))
    : 5;

  const pages = Math.ceil(numberOfMembers / rowInQuerry);
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
          numberOfData={numberOfMembers}
          router={router}
          searchParams={searchParams}
          pathname={pathname} searchByTitle={"Search by username"} buttonTitle={"Create Logbook"} buttonIsAvailable={true}/>
      }
      data={members}
      renderCell={renderCell}
      router={router}
      searchParams={searchParams}
      pathname={pathname}
      emptyContent="No members found"
    />
  );
}
