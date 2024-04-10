import { getLogbooks } from "@/actions/db-actions/logbook-actions/get-logbook";
import LogbookTable from "@/components/logbook-table";

export const dynamic = 'force-dynamic'
export default async function LogBookPage({
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

  const page = searchParams?.page || "1";
  const row = searchParams?.row || "5";
  const search = searchParams?.search || ""
  const sort = searchParams?.sort || ""
  const direction = searchParams?.direction || "ascending"

  const logbooks = await getLogbooks(page, row, search, sort, direction)
  
  return (
    <div className="p-5 h-full">
      <h1 className="text-[30px] pb-5">Catch Logbooks</h1>
      <LogbookTable logbooks={logbooks.logbooks} numberOfLogbook={logbooks.numberOfLogbooks._count.id}/>
    </div>
  );
}


