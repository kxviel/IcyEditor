import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { UserData } from "./api/getUsers";

const columnHelper = createColumnHelper<UserData>();

export const columns = [
  columnHelper.accessor("UNAME", {
    header: () => "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("EMAIL", {
    header: () => "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("MOBILE", {
    header: "Mobile",
  }),
  columnHelper.accessor("IS_SUPER_ADMIN", {
    header: () => <span>Is Super Admin</span>,
  }),
  columnHelper.accessor("IS_SUPER_ADMIN", {
    header: () => <span>Status</span>,
    cell: (info) => <Button>{info.getValue() ? "Active" : "Inactive"}</Button>,
  }),
];
