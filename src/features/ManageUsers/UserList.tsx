import { IconInput } from "@/components/ui/IconInput";
import useDebounce from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { useState } from "react";
import { useGetUsers } from "./api/getUsers";
import { columns } from "./columns";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate, useSearch } from "@tanstack/react-router";
import Pagination from "@/components/ui/pagination";

const UserList = () => {
  const navigate = useNavigate();
  const { page } = useSearch({
    from: "/_auth",
  }) as { page: number };

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, isPending } = useGetUsers({
    page,
    search: debouncedSearch,
  });

  const rowCount = data?.total || 0;

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePageChange = (page: number) => {
    navigate({ to: "/users", search: { page } });
  };

  return (
    <div className="flex h-full flex-col items-center gap-6 pt-6">
      <div className="flex w-full items-center gap-4">
        <h3 className="text-xl font-semibold">Manage Users</h3>
        <IconInput
          placeholder="Search"
          className="w-[320px]"
          startIcon={Search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader className="bg-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="min-h-full bg-white/50">
          {isPending ? (
            <span>Loading...</span>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination
        totalPages={Math.ceil(rowCount / 10)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UserList;
