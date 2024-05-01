import { getfisheryAuthorities } from "@/actions/db-actions/authority-actions/get-authority";
import { auth } from "@/auth";
import AuthorityTable from "@/components/authority-table";
import { FormSections } from "@/components/form/form-section";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
export const dynamic = 'force-dynamic'
export default async function AuthorityPage({
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

  const session = await auth()

  const page = searchParams?.page || "1";
  const row = searchParams?.row || "5";
  const search = searchParams?.search || ""
  const sort = searchParams?.sort || ""
  const direction = searchParams?.direction || "ascending"

  const authorities = await getfisheryAuthorities(page, row, search, sort, direction)
  
  
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

  if (session.user.role === "OPERATOR" || session?.user.role === "INSPECTOR") {
    return (
      <div className="p-5 h-full">
        <h1 className="text-[30px] pb-5">Authorities</h1>
        <h2 className="text-[20px] pb-5">Authorities Table</h2>
        <AuthorityTable
          authorities={authorities.authorities}
          numberOfAuthorities={authorities.numberOfAuthorities._count.id}
        />
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
              "You are not allowed to view authorities!"
            }
          />
        </div>
      </CardBody>
    </Card>
  );
}



