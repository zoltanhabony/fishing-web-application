"use client"
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams} from "next/navigation";

interface TopContentProps {
  numberOfAuthorities: number;
  router: AppRouterInstance
  pathname: string
  searchParams: ReadonlyURLSearchParams
}


export const TopContent = ({ numberOfAuthorities,router,pathname,searchParams }: TopContentProps) => {
  const onSearchChange = (value?: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('search', value);
      params.set('page', "1");
    } else {
      params.delete('search')
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

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
        <Input
          isClearable
          size="sm"
          className="w-full sm:max-w-[44%]"
          placeholder="Search by name..."
          value={searchParams.get("search") ? String(searchParams.get("search")): ""}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          <Button color="primary" onClick={() => router.push("/authority/new")}>
            Add New
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total {numberOfAuthorities} authorities
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
    </div>
  );
};
