import { getMembers } from "@/actions/db-actions/member-actions/get-members";
import { auth } from "@/auth";
import { FormSections } from "@/components/form/form-section";
import MembersTable from "@/components/member-table";
import db from "@/lib/db";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

export default async function MemberPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    row?: string;
    search?: string;
    sort?: string;
    direction?: "ascending" | "descending";
  };
}) {
  const session = await auth();
  const page = searchParams?.page || "1";
  const row = searchParams?.row || "5";
  const search = searchParams?.search || "";
  const sort = searchParams?.sort || "";
  const direction = searchParams?.direction || "ascending";

  const members = await getMembers(page, row, search, sort, direction);
  const access = await db.access.findFirst({
    where:{
      user:{
        email: session?.user.email
      }
    }
  })

  if (!session) {
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

  if (session.user.role === "OPERATOR" || session?.user.role === "INSPECTOR" && access?.accessToAuthority) {
    return (
      <div className="p-5 h-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">Members</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-1">
            <FormSections
              title={"Members Table"}
              description={
                "The table shows the members of the association and their details. Members in the table can be modified and deleted"
              }
            />
            <br />
            </div>
          </CardBody>
        </Card>
        <MembersTable
          members={members.members}
          numberOfMembers={members.numberOfMembers._count.id}
        />
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
              "You are not allowed to view members of the association!"
            }
          />
        </div>
      </CardBody>
    </Card>
  );
}
