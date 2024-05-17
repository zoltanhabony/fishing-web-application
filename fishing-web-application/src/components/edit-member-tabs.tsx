"use client";

import { AccountTypeIcon } from "@/icons/account-type-icon";
import { BookmarkIcon } from "@/icons/sidebar-icons/bookmark-icon";
import { UserIcon } from "@/icons/user-icon";
import { Tab, Tabs } from "@nextui-org/react";
import { FormSections } from "./form/form-section";
import { EditMemberForm } from "./form/edit-member-form";
import { UserRole } from "@prisma/client";
import { ModifyUserAccessForm } from "./form/edit-user-access-form";
import { EditLogbookForm } from "./form/edit-logbook-form";
import { ModifyInspectorAccessForm } from "./form/edit-inspector-access-form";

type memberData = {
  user: {
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    role: UserRole;
    access: {
      id: string;
      userId: string;
      accessToLogbook: boolean;
      accessToAuthority: boolean;
      accessToFishing: boolean;
      accessToPost: boolean;
      accessToMarker: boolean;
      accessToTournament: boolean;
      accessToCatches: boolean;
      accessToInspect: boolean;
    }[];
  };
  id: string;
} | null;

type logbookData = {
  id: string;
  expiresDate: Date;
  member: {
    user: {
      id: string;
      name: string | null;
    };
    fisheryAuthority: {
      id: string;
      fisheryAuthorityName: string;
    };
  } | null;
} | null;

interface EditMemberTabs {
  member: memberData;
  logbook: logbookData;
}

export const EditMemberTabs = ({ member, logbook }: EditMemberTabs) => {
  return (
    <Tabs aria-label="Options" color="primary" variant="bordered" fullWidth>
      <Tab
        key="member"
        title={
          <div className="flex items-center space-x-2">
            <UserIcon className="text-2xl  text-white pointer-events-none" />
            <span>User Data</span>
          </div>
        }
      >
        <div className="space-y-1">
          <FormSections
            title="Edit User Data"
            description="The following fields contain the information for the user account. To edit the data, click on the edit profile button."
          />
          <FormSections
            size="third"
            title="User Details"
            description="In the fields below, you can change the user's details or moderate the user's details at their request"
          />
          <EditMemberForm memberData={member} />
        </div>
      </Tab>
      <Tab
        key="userAccess"
        title={
          <div className="flex items-center space-x-2">
            <AccountTypeIcon className="text-2xl  text-white pointer-events-none" />
            <span>Access</span>
          </div>
        }
      >
        <div className="space-y-1">
          <FormSections
            title="User Permissions"
            description="Change the user's permissions using the following fields."
          />
          {member?.user.role === UserRole.INSPECTOR ? <ModifyInspectorAccessForm memberData={member}/> : <ModifyUserAccessForm memberData={member} />}
        </div>
      </Tab>
      <Tab
        key="videos"
        title={
          <div className="flex items-center space-x-2">
            <BookmarkIcon className="text-2xl text-white pointer-events-none" />
            <span>Logbook</span>
          </div>
        }
      >
        <div className="space-y-1">
          <FormSections
            title="Edit Logbook Data"
            description="The following fields are required. These data will be necessary to identify the associations and to create the digital catch logbook"
          />
          {logbook ? (
            <EditLogbookForm
              data={{
                id: logbook.id,
                expiresDate: logbook.expiresDate,
                member: logbook.member,
              }}
            />
          ) : (
            ""
          )}
        </div>
      </Tab>
    </Tabs>
  );
};
