import http from "@/config/https";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  body: {
    username: "sf";
    email: "er@we";
    phone: "43434343434";
    password: "JawuR&CrM$Ta9PJzzKZ!";
    city: "1";
    state: "1";
    school: "erer";
  };
};

const forgotPasswordFn = ({ body }: Props) => {
  return http.post("/login", body);
};

export const useForgotPasswordFn = () => {
  return useMutation({
    mutationFn: forgotPasswordFn,
    onSuccess: ({ data }) => {
      toast.success("Heh");
    },
    onError: (err) => {
      toast.error("AAAAA");
    },
  });
};
