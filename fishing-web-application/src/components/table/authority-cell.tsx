"use client";

import { removefisheryAuthorities } from "@/actions/db-actions/authority-actions/remove-authority";
import { Actions } from "./action";


export const columns = [
  { name: "ID", uid: "id", sortable: false },
  { name: "NAME", uid: "fisheryAuthorityName", sortable: true },
  { name: "TAXID", uid: "taxId", sortable: false },
  { name: "CITY", uid: "cityName", sortable: true },
  { name: "ADDRESS", uid: "address", sortable: false },
  { name: "ACTIONS", uid: "actions" },
];

export const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "fisheryAuthorityName",
  "taxId",
  "cityName",
  "address",
  "actions",
];

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
}

export const authorityRenderCell = (
  authority: authorityTableResponse,
  columnKey: React.Key
) => {
  const cellValue = authority[columnKey as keyof authorityTableResponse];
  switch (columnKey) {
    case "id":
      return authority.fisheryAuthority.id;
    case "fisheryAuthorityName":
      return authority.fisheryAuthority.fisheryAuthorityName;
    case "taxId":
      return authority.fisheryAuthority.taxId;
    case "cityName":
      return authority.fisheryAuthority.address.city.cityName;
    case "address":
      return authority.fisheryAuthority.address.streetName + " " + authority.fisheryAuthority.address.streetNumber;
    case "actions":
      const removeAuthority = removefisheryAuthorities.bind(null, authority.fisheryAuthority.id)
      const id = authority.fisheryAuthority.id 
      return (
        <Actions delete={{tooltip: "Delete", action: removeAuthority, type:"submit", deleteTitle:"Delete Authority", deleteMessage:"Deletion of associations is a fatal operation, it cannot be restored. Before deleting, make sure that you have informed your users and transferred their logbook's to another association. All catch data and statistics will be lost, maps and tournaments will be deleted."}} detail={{tooltip: "Detail", type:"button", id:id}} edit={{tooltip: "Edit", type:"button", id:id}}/>
      );
    default:
      return cellValue;
  }
};
