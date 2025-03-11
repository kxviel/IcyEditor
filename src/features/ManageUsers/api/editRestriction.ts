import http from "@/config/https";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  userId: number;
};

const mutationFn = (body: Props) => {
  return http.put(`/auth/update-restricted-access/${body.userId}`);
};

export const useEditRestriction = () => {
  const { saveUser } = useAuth();

  return useMutation({
    mutationFn,
    onSuccess: ({ data }) => {
      saveUser(data.data);
      toast.success("Updated User Access");
      queryClient.invalidateQueries({ queryKey: ["GetUsers"] });
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
