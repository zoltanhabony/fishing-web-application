"use client";

import { removeLogbook } from "@/actions/db-actions/logbook-actions/remove-logbook";
import { Actions } from "./action";


export const columns = [
  { name: "LOGBOOK ID", uid: "id", sortable: false },
  { name: "USERNAME", uid: "name", sortable: true },
  { name: "NAME", uid: "fisheryAuthorityName", sortable: true },
  { name: "EXPIRES DATE", uid: "expiresDate", sortable: false },
  { name: "ACTIONS", uid: "actions" },
];

export const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "fisheryAuthorityName",
  "name",
  "expiresDate",
  "actions",
];

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

export const logbookRenderCell = (
  logbook: logbookTableResponse,
  columnKey: React.Key
) => {
  const cellValue = logbook[columnKey as keyof logbookTableResponse];

  switch (columnKey) {
    case "id":
      return logbook.id;
    case "fisheryAuthorityName":
      return logbook.member !== null ? logbook.member.fisheryAuthority.fisheryAuthorityName : "" ;
    case "name":
      return logbook.member ? logbook.member.user.name : "" ;
    case "expiresDate":
      return logbook.expiresDate.toLocaleString()
    case "actions":
        
      const removeLogbookHandler = removeLogbook.bind(null, logbook.id)

      const id = logbook.id
      return (
        <Actions delete={{tooltip: "Delete", type:"submit", action:removeLogbookHandler}} detail={{tooltip: "Detail", type:"button", id:id}} edit={{tooltip: "Edit", type:"button", id:id}}/>
      );
    default:
      return cellValue;
  }
};
