import { FormSections } from "@/components/form/form-section";
import { CreateCatchForm } from "@/components/form/new-catch-form";
import { CreateLogbookForm } from "@/components/form/new-logbook-form";
import { Card, CardBody, CardHeader, divider } from "@nextui-org/react";
import { auth } from "@/auth";
import db from "@/lib/db";
import { CreateFishingDateForm } from "@/components/form/new-fishing-date";

export default async function CreateLogbookPage() {
  const session = await auth();

  if (!session) {
    return (
      <div>
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">Add New Catch</h1>
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
      </div>
    );
  }

  const isFishing = await db.isFishing.findFirst({
    where: {
      user: {
        email: session.user.email,
      },
    },
    select: {
      date: true,
    },
  });

  if (session.user.role !== "USER") {
    return (
      <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">Add New Catch</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-1">
              <FormSections
                title={"The operation is not allowed!"}
                description={
                  "Operators and inspectors are not allowed to record catches!"
                }
              />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }


  if (!isFishing?.date || isFishing?.date.toLocaleDateString() !== new Date().toLocaleDateString()) {
    return (
      <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">No selected fishing day</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-1">
              <FormSections
                title="Start fishing"
                description="Start fishing and save catched fish!"
              />
              <CreateFishingDateForm/>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Add New Catch</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title="New Catch"
              description="The following fields are required. These data will be necessary to identify the catches and build the logbook"
            />
            <CreateCatchForm />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
