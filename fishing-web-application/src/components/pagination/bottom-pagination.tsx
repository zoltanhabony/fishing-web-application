"use client";
import { Pagination } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface BottomContentProps {
  pages: number;
}


export const BottomPagination = ({
  pages
}: BottomContentProps) => {

const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  return (
    <div className="py-2 px-2 flex justify-between items-center">
      <Pagination
        loop
        isCompact
        showControls
        showShadow
        color="primary"
        page={searchParams.get("page")? Number(searchParams.get("page")) : 1}
        total={pages}
        //itt a hiba
        onChange={(page)=>{
          params.set("page", ""+page)
          router.replace(`${pathname}?${params.toString()}`)
        }}
      />
    </div>
  );
};