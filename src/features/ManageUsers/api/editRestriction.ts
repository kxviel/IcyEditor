import http from "@/config/https";
import { queryClient } from "@/main";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  userId: number;
};

const mutationFn = (body: Props) => {
  return http.put(`/auth/update-restricted-access/${body.userId}`);
};

export const useEditRestriction = () => {
  const saveUser = useAuthStore((state) => state.saveUser);

  return useMutation({
    mutationFn,
    onSuccess: ({ data }) => {
      saveUser(data.data);
      toast.success("Updated User Access");
      queryClient.refetchQueries({ queryKey: ["GetUsers"] });
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
