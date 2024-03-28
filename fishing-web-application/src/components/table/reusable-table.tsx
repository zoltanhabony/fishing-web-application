"use client"
import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { columns } from "./authority-cell";
import { ReadonlyURLSearchParams} from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface IReusableTableProps<T> {
  bottomContent: JSX.Element;
  topContent: JSX.Element;
  data: Array<T & { id?: string }>;
  renderCell: (
    data: T,
    columnKey: React.Key
  ) => any;
  router: AppRouterInstance
  pathname: string
  searchParams: ReadonlyURLSearchParams
  emptyContent: string
}

type SortDirection = "ascending" | "descending";

export const ReusableTable = <T,>(props: IReusableTableProps<T>) => {
  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={props.bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "",
      }}
      topContent={props.topContent}
      topContentPlacement="outside"
      sortDescriptor={undefined}

      onSortChange={(descriptor: SortDescriptor) => {
        let params = new URLSearchParams(props.searchParams.toString())
        let sort = descriptor.column as string
        let dir = descriptor.direction as string
        params.set("sort", sort)
        params.set("direction", dir)
        props.router.replace(`${props.pathname}?${params.toString()}`)
      }}

      
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={props.emptyContent} items={props.data}>
      {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{props.renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
