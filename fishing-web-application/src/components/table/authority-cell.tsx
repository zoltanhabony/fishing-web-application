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
  id: string
  fisheryAuthorityName: string
  taxId: string
  address: {
    city: {
      cityName: string
    };
    streetName: string,
    streetNumber: number
    floor: number | null
    door: number | null
  };
};

export const authorityRenderCell = (
  authority: authorityTableResponse,
  columnKey: React.Key
) => {
  const cellValue = authority[columnKey as keyof authorityTableResponse];
  switch (columnKey) {
    case "id":
      return authority.id;
    case "fisheryAuthorityName":
      return authority.fisheryAuthorityName;
    case "taxId":
      return authority.taxId;
    case "cityName":
      return authority.address.city.cityName;
    case "address":
      return authority.address.streetName + " " + authority.address.streetNumber;
    case "actions":
      const removeAuthority = removefisheryAuthorities.bind(null, authority.id)
      const id = authority.id 
      return (
        <Actions delete={{tooltip: "Delete", action: removeAuthority, type:"submit"}} detail={{tooltip: "Detail", type:"button", id:id}} edit={{tooltip: "Edit", type:"button", id:id}}/>
      );
    default:
      return cellValue;
  }
};
