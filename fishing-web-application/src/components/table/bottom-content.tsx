"use client";
import { Pagination } from "@nextui-org/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";

interface BottomContentProps {
  pages: number;
  router: AppRouterInstance;
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
}

export const BottomContent = ({
  pages,
  searchParams,
  router,
  pathname
}: BottomContentProps) => {


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
        onChange={(page)=>{
          params.set("page", ""+page)
          router.replace(`${pathname}?${params.toString()}`)
        }}
      />
    </div>
  );
};
