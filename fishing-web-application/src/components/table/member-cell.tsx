"use client";

import { UserRole } from "@prisma/client";
import { Actions } from "./action";
import { deleteMember } from "@/actions/db-actions/member-actions/delete-member";
import { useSession } from "next-auth/react";

export const columns = [
  { name: "MEMBER ID", uid: "memberId", sortable: false },
  { name: "USERNAME", uid: "name", sortable: false },
  { name: "FIRST NAME", uid: "firstName", sortable: false },
  { name: "LAST NAME", uid: "lastName", sortable: false },
  { name: "LOGBOOK ID", uid: "logbookId", sortable: false },
  { name: "LOGBOOK EXPIRES DATE", uid: "expiresDate", sortable: false },
  { name: "FISHERY AUTHORITY", uid: "fisheryAuthority", sortable: false },
  { name: "ACTIONS", uid: "actions" },
];

export const INITIAL_VISIBLE_COLUMNS = [
  "memberId",
  "name",
  "firstName",
  "lastName",
  "logbookId",
  "expiresDate",
  "fisheryAuthority",
  "actions",
];

type memberTableResponse = {
  id: string;
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
  } | null;
};

export const memberRenderCell = (
  members: memberTableResponse,
  currentRole: UserRole | undefined,
  columnKey: React.Key
) => {
  const cellValue = members[columnKey as keyof memberTableResponse]
  switch (columnKey) {
    case "memberId":
      return members.id;
    case "name":
      return members.user.name;
    case "firstName":
      return members.user.firstName;
    case "lastName":
      return members.user.lastName;
    case "logbookId":
      return members.logBook?.id;
    case "expiresDate":
      return members.logBook?.expiresDate.toLocaleDateString();
    case "fisheryAuthority":
      return members.fisheryAuthority.fisheryAuthorityName;
    case "actions":
      const id = members.id;
      let role = members.user.role;
      const removeMember = deleteMember.bind(null, id);

      const isEditable =
        members.user.role === currentRole ? (
          <p className="text-default text-xs">No actions available</p>
        ) : (members.user.role === UserRole.OPERATOR ? <p className="text-default text-xs">No actions available</p> : <Actions
          detail={{ tooltip: "Detail", type: "button", id: id }}
          edit={{ tooltip: "Edit", type: "button", id: id }}
          delete={{
            tooltip: "Delete",
            action: removeMember,
            type: "submit",
            deleteTitle: "Delete Member",
            deleteMessage:
              "Deleting a user from the members is a fatal and irrevocable action! Deleting a member will delete the catch log and the catches associated with it. If the customer wishes to transfer to another association, please change the name of the association in your catch logbook!",
          }}
        />);
      return isEditable;

    default:
      return cellValue;
  }
};
