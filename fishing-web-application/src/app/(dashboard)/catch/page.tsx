import { getAllCatches } from "@/actions/db-actions/catch-actions/get-all-catch";
import { auth } from "@/auth";
import CatchesTable from "@/components/catches-table";
import { FormSections } from "@/components/form/form-section";
import db from "@/lib/db";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

export const dynamic = 'force-dynamic'
export default async function CatchPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    row?: string;
    search?: string;
    sort?: string;
    direction?: "ascending" | "descending";
    filter?: "all" | "member"
    isSaved: "true" | "false" | "undefined",
  };
}) {

  const page = searchParams?.page || "1";
  const row = searchParams?.row || "5";
  const search = searchParams?.search || ""
  const sort = searchParams?.sort || ""
  const direction = searchParams?.direction || "ascending"
  const filter = searchParams?.filter || "all"
  const isSaved = searchParams?.isSaved || "undefined"

  const session = await auth()

  const catches = await getAllCatches(page, row, search, sort, direction, filter, isSaved)

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
          <h1 className="text-[30px]">Catches</h1>
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

  if(session.user.role === "OPERATOR" || session.user.role === "INSPECTOR" && access?.accessToCatches){
    return (
      <div className="p-5 h-full">
         
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">Catches</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-1">
            <FormSections
              title={"Catches Table"}
              description={
                "The table shows the fish caught in your associations' waters and their data per user!"
              }
            />
            <br />
            </div>
          </CardBody>
        </Card>
        <CatchesTable catches={catches.catches} numberOfCatches={catches.numberOfCatches._count.id}/>
      </div>
    );
  }
  
  return (
    <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
      <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
        <h1 className="text-[30px]">Catches</h1>
      </CardHeader>
      <CardBody>
        <div   className="space-y-1">
          <FormSections
            title={"You have no access!"}
            description={
              "You are not allowed to view member's catches!"
            }
          />
        </div>
      </CardBody>
    </Card>
  );
}


