import { getfisheryAuthorities } from "@/actions/db-actions/authority-actions/get-authority";
import AuthorityTable from "@/components/table";
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

  const page = searchParams?.page || "1";
  const row = searchParams?.row || "5";
  const search = searchParams?.search || ""
  const sort = searchParams?.sort || ""
  const direction = searchParams?.direction || "ascending"

  const authorities = await getfisheryAuthorities(page, row, search, sort, direction)
  return (
    <div className="p-5 h-full">
      <h1 className="text-[30px] pb-5">Authority</h1>
      <AuthorityTable authorities={authorities.authorities} numberOfAuthorities={authorities.numberOfAuthorities._count.id}/>
    </div>
  );
}


