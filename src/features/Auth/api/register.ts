import http from "@/config/https";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  body: {
    username: string;
    email: string;
    phone: string;
    password: string;
    city: string;
    state: string;
    school: string;
  };
};

const registerFn = ({ body }: Props) => {
  return http.post("/register", body);
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
