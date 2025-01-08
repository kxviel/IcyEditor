import http from "@/config/https";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  body: {
    email: string;
    password: string;
  };
};

const loginFn = ({ body }: Props) => {
  return http.post("/login", body);
};

export const useLoginFn = () => {
  return useMutation({
    mutationFn: loginFn,
    onSuccess: () => {
      toast.success("Heh");
    },
    onError: () => {
      toast.error("AAAAA");
    },
  });
};
