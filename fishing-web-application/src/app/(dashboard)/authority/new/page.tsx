import { auth } from "@/auth";
import { FormSections } from "@/components/form/form-section";
import { CreateAuthorityForm } from "@/components/form/new-authority-form";
import { BackIcon } from "@/icons/back-icon";
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";

export default async function CreateAuthorityPage() {
  const session = await auth();

  if (!session) {
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Authorities</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title={"Authorization failed!"}
              description={"There is no valid session! Sign in again!"}
            />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (session?.user.role === "OPERATOR") {
    return (
      <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <Link href={"/authority"} className="pb-3 text-sm flex">
              <BackIcon />
              <span className="pl-3">{"back to list of authorities"}</span>
            </Link>
            <h1 className="text-[30px]">Create New Authority</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-1">
              <FormSections
                title="New Authority"
                description="The following fields are required. These data will be necessary to identify the associations and to create the digital catch logbook"
              />
            </div>
            <CreateAuthorityForm />
          </CardBody>
        </Card>
      </div>
    );
  }
  return (
    <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
      <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
        <h1 className="text-[30px]">Authorities</h1>
      </CardHeader>
      <CardBody>
        <div   className="space-y-1">
          <FormSections
            title={"You have no access!"}
            description={
              "You are not allowed to create authorities!"
            }
          />
        </div>
      </CardBody>
    </Card>
  );
}
