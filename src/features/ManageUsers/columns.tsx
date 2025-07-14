import { createColumnHelper } from "@tanstack/react-table";
import { UserData } from "./api/getUsers";
import { Switch } from "@/components/ui/switch";
import http from "@/config/https";
import { toast } from "sonner";
import { queryClient } from "@/main";

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
      const editRestriction = () => {
        const userId = info.row.original?.id;

        if (userId) {
          http
            .put(`/auth/update-restricted-access/${userId}`)
            .then(() => {
              toast.success("Updated User Access");
              queryClient.refetchQueries({ queryKey: ["GetUsers"] });
            })
            .catch((err) => {
              toast.error(err);
            });
        }
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
