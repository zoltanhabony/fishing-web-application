import { getCatchByUser } from "@/actions/db-actions/catch-actions/get-user-catch";
import { auth } from "@/auth";
import { FormSections } from "@/components/form/form-section";
import LogbookTable from "@/components/member-table";
import UserCatchesTable from "@/components/user-catches-table";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

export const dynamic = "force-dynamic";
export default async function LogBookPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    row?: string;
    search?: string;
    sort?: string;
    direction?: "ascending" | "descending";
    isSaved: "true" | "false" | "undefined";
  };
}) {
  const session = await auth();
  const page = searchParams?.page || "1";
  const row = searchParams?.row || "5";
  const search = searchParams?.search || "";
  const sort = searchParams?.sort || "";
  const direction = searchParams?.direction || "ascending";
  const isSaved = searchParams?.isSaved || "undefined";

  if (!session) {
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Logbook</h1>
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

  if (session.user.role === "OPERATOR" || session?.user.role === "INSPECTOR") {
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Logbook</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title={"You have no logbook!"}
              description={
                "You don't have logbook! This feature only available for users."
              }
            />
          </div>
        </CardBody>
      </Card>
    );
  }

  const catches = await getCatchByUser(
    page,
    row,
    search,
    sort,
    direction,
    isSaved
  );
  console.log(catches.catches);

  if (session.user.role === "USER") {
    return (
      <div className="p-5 h-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col">
            <h1 className="text-[30px]">Catch Logbooks</h1>
          </CardHeader>
          <CardBody>
            <FormSections
              title={"Saved catches"}
              description={
                "The table below shows all the fish saved. You can see the fish in the catch log in the tags column, labelled Saved"
              }
            />
          </CardBody>
        </Card>
        <br />
        <UserCatchesTable
          catches={catches.catches}
          numberOfCatches={catches.numberOfCatches}
        />
      </div>
    );
  }
}
