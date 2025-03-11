import { createColumnHelper } from "@tanstack/react-table";
import { UserData } from "./api/getUsers";
import { Switch } from "@/components/ui/switch";
import http from "@/config/https";
import { toast } from "sonner";

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
  columnHelper.accessor("RESTRICTED_ACCESS", {
    header: () => <span>Is Restricted</span>,
    cell: (info) => {
      const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
      const editRestriction = () => {
        http
          .put(`/auth/update-restricted-access/${userId}`)
          .then((data) => {
            toast.success("Updated User Access");
            localStorage.setItem("user", JSON.stringify(data.data));
          })
          .catch((err) => {
            toast.error(err);
          });
      };

      return (
        <Switch
          checked={info.getValue() > 0}
          onCheckedChange={editRestriction}
        />
      );
    },
  }),
];
