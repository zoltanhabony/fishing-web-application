import { auth } from "@/auth";
import { FormSections } from "@/components/form/form-section";
import { CreateLogbookForm } from "@/components/form/new-logbook-form";
import { BackIcon } from "@/icons/back-icon";
import db from "@/lib/db";
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";

export default async function CreateLogbookPage() {
  const session = await auth()
  const access = await db.access.findFirst({
    where:{
      user:{
        email: session?.user.email
      }
    }
  })
  if(!session){
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Members</h1>
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

  if(session?.user.role === "OPERATOR" || (session?.user.role === "INSPECTOR" && access?.accessToAuthority)){
    return (
      <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <Link href={"/member"} className="pb-3 text-sm flex">
            <BackIcon />
            <span className="pl-3 text-primary">{"back to list of members"}</span>
          </Link>
            <h1 className="text-[30px]">Create New Logbook</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-1">
              <FormSections
                title="New Logbook"
                description="The following fields are required. These data will be necessary to identify the catches and members"
              />
              <CreateLogbookForm />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
      <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
        <h1 className="text-[30px]">Members</h1>
      </CardHeader>
      <CardBody>
        <div   className="space-y-1">
          <FormSections
            title={"You have no access!"}
            description={
              "You are not allowed to create member and logbook!"
            }
          />
        </div>
      </CardBody>
    </Card>
  );
}
