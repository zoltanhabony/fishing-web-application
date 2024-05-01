"use client";

import { Chip, User } from "@nextui-org/react";
import { Actions } from "./action";
import { deleteCatch } from "@/actions/db-actions/catch-actions/delete-catch";

export const columns = [
    { name: "CATCH ID", uid: "id", sortable: false },
    { name: "WATER AREA CODE", uid: "waterAreaCode", sortable: false },
    { name: "WATER AREA NAME", uid: "waterAreaName", sortable: false },
    { name: "DATE", uid: "createdAt", sortable: false },
    { name: "FISH TYPE", uid: "fishId", sortable: false },
    { name: "WEIGHT", uid: "weight", sortable: false },
    { name: "LENGTH", uid: "length", sortable: false },
    { name: "PIECE", uid: "piece", sortable: false },
    { name: "TAGS", uid: "tags", sortable: false },
    { name: "ACTIONS", uid: "actions", sortable: false },
];

export const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "fishId",
  "weight",
  "length",
  "piece",
  "waterAreaCode",
  "waterAreaName",
  "tags",
  "createdAt",
  "actions"
];


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
        value: any;
        unit:{
            unitAcronyms: string
        }
    }[];
  }

export const userCatchesRenderCell = (
  catches: catchesTableResponse,
  columnKey: React.Key
) => {
  const cellValue = catches[columnKey as keyof catchesTableResponse];

  switch (columnKey) {
    case "id":
      return catches.id;
    case "waterAreaCode":
      return catches.waterArea.waterAreaCode;
    case "waterAreaName":
      return catches.waterArea.waterAreaName;
      case "createdAt":
        return catches.createdAt.toLocaleDateString()
    case "fishId":
      return (
        <User
          avatarProps={{
            size: "lg",
            radius: "lg",
            src: catches.fish.fishImageURL,
            className: "p-2"
          }}
          description={catches.fish.id}
          name={catches.fish.fishName}
        >
          {catches.fish.id}
        </User>
      );

    case "weight":
      return (
        catches.CatchDetails[0].value !== "0" ? catches.CatchDetails[0].value +
        " " +
        catches.CatchDetails[0].unit.unitAcronyms : "-"
      );

    case "length":
      return (
        catches.CatchDetails[1].value !== "0" ? catches.CatchDetails[1].value +
        " " +
        catches.CatchDetails[1].unit.unitAcronyms : "-"
      );

    case "piece":
      return (
        catches.CatchDetails[2].value !== "0" ? catches.CatchDetails[2].value +
        " " +
        catches.CatchDetails[2].unit.unitAcronyms : "-"
      );

    case "tags":
    return(
        <div className="flex justify-between flex-wrap">
            {catches.isStored ? <Chip color="secondary" className="m-1" size="sm" >Saved</Chip> : ""}
            {catches.isInjured ? <Chip color="danger" size="sm" className="m-1">Injured</Chip> : ""}
        </div>
    )

    case "actions":
      const id = catches.id;
      const removeCatch = deleteCatch.bind(null, id)
      return (
        <Actions
          detail={{ tooltip: "Detail", type: "button", id: id, actionURL:`/catch/${id}`}}
          edit={{ tooltip: "Edit", type: "button", id: id, permissonsToAction: !catches.isStored, actionURL:`/catch/${id}/edit` }}
          delete={{tooltip: "Delete", action:removeCatch ,type:"submit", deleteTitle:"Delete Catch", deleteMessage:"When you delete the catch, all data will be lost. The operation cannot be restored.", permissonsToAction: !catches.isStored}}
        />
      );


    default:
      return cellValue;
  }
};
