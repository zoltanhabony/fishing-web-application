import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { UpdateProfileForm } from "@/components/auth/update-profile-form";
import { FormSections } from "@/components/form/form-section";
import { getProfileData } from "@/actions/db-actions/profile-data";

export default async function ProfilePage() {

  const profileData = await getProfileData() 

  return (
    <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px] pb-5">Profile settings</h1>
          <Avatar
            isBordered
            color="default"
            src={profileData?.image ? profileData.image : ""}
            className="h-[100px] w-[100px]"
          />
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title="Personal information"
              description="The following fields contain the information for the user account.
              To edit the data, click on the edit profile button."
            />
          </div>
          <UpdateProfileForm profileData={profileData}/>
          <Divider className="my-4" />
          <FormSections
            title="Logbook information"
            description="The following fields contain the catch logbook data. The data can only
be modified by the association's administrators. This process may
vary from association to association."
          />
        </CardBody>
      </Card>
    </div>
  );
}
