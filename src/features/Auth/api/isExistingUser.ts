import http from "@/config/https";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { GoogleRes } from "./loginWithGoogle";
import { useNavigate } from "@tanstack/react-router";
import { useRegisterFn } from "./register";

type Res = {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: boolean;
};

const useIsExistingUserFn = (body: GoogleRes) => {
  return http.post("/auth/existing-user", { email: body.email });
};

export const useIsExistingUser = () => {
  const navigate = useNavigate();
  const register = useRegisterFn();

  return useMutation({
    mutationFn: useIsExistingUserFn,
    onSuccess: ({ data }: AxiosResponse<Res>, variables) => {
      if (data.data) {
        //User Exists
        navigate({ to: "/" });
      } else {
        //Register New User
        const registerBody = {
          name: variables.name,
          email: variables.email,
        };
        register.mutate({ body: registerBody, isGoogleAuth: true });
      }
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
