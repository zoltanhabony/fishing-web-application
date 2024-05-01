"use client"
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams} from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface TopContentProps {
  numberOfData: number;
  router: AppRouterInstance
  pathname: string
  searchParams: ReadonlyURLSearchParams;
  searchByTitle: string
  buttonTitle: string
  buttonIsAvailable: boolean
  filterElement?: JSX.Element;
  buttonURL?: string
}


export const TopContent = ({ numberOfData,router,pathname,searchParams, searchByTitle, buttonTitle, buttonIsAvailable, filterElement, buttonURL }: TopContentProps) => {

  const [search, setSearch] = useState<string>("");
  const [debounceSearch] = useDebounce<string>(search, 500);
  const onSearchChange = (value: string) => {
    setSearch(value);
  };
  
  useEffect(()=>{
      const params = new URLSearchParams(searchParams)
      if (debounceSearch) {
        params.set('search', debounceSearch);
        params.set('page', "1");
      } else {
        params.delete('search')
      }
      router.replace(`${pathname}?${params.toString()}`);
  }, [debounceSearch, pathname, router, search, searchParams])
  
  

  const onClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search')
    params.set('page', "1");
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('row', ""+e.target.value);
    params.set('page', "1");
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <div className="w-full">
        <h5 className="text-sm pb-2">Search</h5>
        <Input
          isClearable
          size="md"
          className="w-full sm:max-w-[44%]"
          placeholder={searchByTitle}
          value={search}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        </div>
        <div className="flex gap-3">
          {buttonIsAvailable ? <Button color="primary" onClick={() => { buttonURL ? router.push(buttonURL): router.push(`${pathname}/new`)}}>
            {buttonTitle}
          </Button> : ""}
        </div>
      </div>
      {filterElement ? <div>
        <h5 className="text-sm pb-2">Filters</h5>
        {filterElement}
      </div> : ""}
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total {numberOfData} row
        </span>
        <Select
          size="sm"
          label="Select row count"
          className="max-w-xs"
          selectedKeys={searchParams.get("row") ? [String(searchParams.get("row"))] : ["5"]}
          onChange={handleSelectionChange}
        >
          <SelectItem key="1" value={1}>
            1
          </SelectItem>
          <SelectItem key="5" value={5}>
            5
          </SelectItem>
          <SelectItem key="10" value={10}>
            10
          </SelectItem>
          <SelectItem key="15" value={15}>
            15
          </SelectItem>
        </Select>
      </div>
      <h5 className="text-sm pb-2">Table</h5> 
    </div>
  );
};
