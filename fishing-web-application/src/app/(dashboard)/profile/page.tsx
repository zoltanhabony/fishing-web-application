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
import { UserAvatar } from "@/components/card/user-card";

export default async function ProfilePage() {

  const profileData = await getProfileData() 


  return (
    <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px] pb-5">Profile settings</h1>
          <div className="space-y-1">
            <FormSections
              title="Personal information"
              description="The following fields contain the information for the user account.
              To edit the data, click on the edit profile button."
            />
            <br />
          </div>
          <UserAvatar
              image={profileData?.image ? profileData.image : ""}
              username={profileData?.name ? profileData.name : ""}
              email={profileData?.email ? profileData.email : ""}
              firstName={profileData?.firstName ? profileData.firstName : ""}
              lastName={profileData?.lastName ? profileData.lastName : ""}
            />
        </CardHeader>
        <CardBody className="space-y-3">
          <UpdateProfileForm profileData={profileData}/>
          
          <FormSections
            title="Logbook information"
            description="The following fields contain the catch logbook data. The data can only
be modified by the association's administrators. This process may
vary from association to association."
          />
          <br/>
          {profileData?.member[0] ? profileData?.member[0].logBook ? <div className="space-y-2">
          <div className="flex items-center space-x-2">
              <p className="text-sm">Logbook ID:</p>
              <p className="text-sm text-primary">{profileData?.member[0].logBook?.id}</p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm">Water Area Code:</p>
              <p className="text-sm text-primary">
                {profileData?.member[0].fisheryAuthority.waterArea.waterAreaCode}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm">Water Area Name:</p>
              <p className="text-sm text-primary">
                {profileData?.member[0].fisheryAuthority.waterArea.waterAreaName}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm">Authority Name:</p>
              <p className="text-sm text-primary">
                {profileData?.member[0].fisheryAuthority.fisheryAuthorityName}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm">Logbook Expires Date:</p>
              <p className="text-sm text-primary">
                {profileData.member[0].logBook.expiresDate.toLocaleDateString()}
              </p>
            </div>
            </div> : <p className="text-sm text-primary">You do not have a catch logbook</p> : <p className="text-sm text-primary">You do not have a catch logbook</p>}
        </CardBody>
      </Card>
    </div>
  );
}
