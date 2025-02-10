import http from "@/config/https";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  body: {
    name: string;
    email: string;
    password: string;
  };
};

const registerFn = ({ body }: Props) => {
  return http.post("/auth/register", body);
};

export const useRegisterFn = () => {
  return useMutation({
    mutationFn: registerFn,
    onSuccess: () => {
      toast.success("Heh");
    },
    onError: () => {
      toast.error("AAAAA");
    },
  });
};
