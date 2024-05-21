import { auth } from "@/auth";
import { FormSections } from "@/components/form/form-section";
import { CreateLogbookForm } from "@/components/form/new-logbook-form";
import { CreateTournamentForm } from "@/components/form/new-tournament-form";
import { BackIcon } from "@/icons/back-icon";
import { Card, CardBody, CardHeader, Link} from "@nextui-org/react";

export default async function CreateLogbookPage () {
   const session = await auth()

   if(!session){
    return (
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">Tournaments</h1>
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

   if(session.user.role !== "OPERATOR"){
    return (
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">Tournaments</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-1">
              <FormSections
                title={"Authorization failed!"}
                description={"You are not allowed to create a competition!"}
              />
            </div>
          </CardBody>
        </Card>
      );
   }

   return (
    <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <Link href={"/tournament"} className="pb-3 text-sm flex">
            <BackIcon />
            <span className="pl-3">{"back to list of tournaments"}</span>
          </Link>
          <h1 className="text-[30px]">Create New Tournament</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title="New Tournament"
              description="The following fields are mandatory. This information is used to determine the information required for a competition."
            />
            <CreateTournamentForm/>
          </div>
        </CardBody>
      </Card>
    </div>

)
}