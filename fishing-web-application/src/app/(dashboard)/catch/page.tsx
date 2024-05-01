import { getAllCatches } from "@/actions/db-actions/catch-actions/get-all-catch";
import CatchesTable from "@/components/catches-table";
import { FormSections } from "@/components/form/form-section";

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

  const catches = await getAllCatches(page, row, search, sort, direction, filter, isSaved)
  
  return (
    <div className="p-5 h-full">
      <h1 className="text-[30px] pb-5">Catches</h1>
      <FormSections
            title={"Catches Table"}
            description={
              "The table shows the fish caught in your associations' waters and their data per user!"
            }
          />
          <br />
      <CatchesTable catches={catches.catches} numberOfCatches={catches.numberOfCatches._count.id}/>
    </div>
  );
}


