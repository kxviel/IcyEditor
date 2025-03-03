import http from "@/config/https";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { GoogleRes } from "./loginWithGoogle";
import { useNavigate } from "@tanstack/react-router";
import { useRegisterFn } from "./register";
import { useAuth } from "@/hooks/useAuth";

interface RootResponse {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: Data;
}

interface Data {
  id: number;
  STATUS: any;
  DEALER_ID: any;
  EMAIL: string;
  PASSWORD: string;
  MOBILE: any;
  SCHOOL_ID: any;
  UNAME: string;
  school: any;
  city: any;
  state: any;
  PUBLICATION_ID: any;
  SERIES_ID: any;
  IS_SUPER_ADMIN: number;
  RESTRICTED_ACCESS: number;
  token: string;
  status: string;
}

const useIsExistingUserFn = (body: GoogleRes) => {
  return http.post("/auth/existing-user", { email: body.email });
};

export const useIsExistingUser = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const register = useRegisterFn();

  return useMutation({
    mutationFn: useIsExistingUserFn,
    onSuccess: ({ data }: AxiosResponse<RootResponse>, variables) => {
      if (data.data) {
        //User Exists
        signIn(data.data);
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
