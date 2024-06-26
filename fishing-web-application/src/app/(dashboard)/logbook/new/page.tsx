import { FormSections } from "@/components/form/form-section";
import { CreateLogbookForm } from "@/components/form/new-logbook-form";
import { BackIcon } from "@/icons/back-icon";
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";

export default function CreateLogbookPage() {
  return (
    <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
        <Link href={"/member"} className="pb-3 text-sm flex">
            <BackIcon />
            <span className="pl-3">{"back to list of members"}</span>
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
