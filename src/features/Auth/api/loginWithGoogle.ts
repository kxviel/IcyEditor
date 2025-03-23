import { useGoogleLogin } from "@react-oauth/google";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import http from "@/config/https";
import { useNavigate } from "@tanstack/react-router";
import { useModalStore } from "@/store/useModalStore";
import { useState } from "react";
import { useAuthStore, User } from "@/store/useAuthStore";

interface ExistingUser {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: User | boolean;
}

export type GoogleRes = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
};

type Props = {
  name: string;
  email: string;
};

const registerFn = (data: Props): Promise<AxiosResponse<ExistingUser>> => {
  return http.post("/auth/register", data);
};

const isExistingUserFn = (
  email: string,
): Promise<AxiosResponse<ExistingUser>> => {
  return http.post("/auth/existing-user", { email });
};

export const useLoginWithGoogle = () => {
  const navigate = useNavigate();
  const saveUser = useAuthStore((state) => state.saveUser);
  const setModal = useModalStore((state) => state.setModal);

  const [isPending, setIsPending] = useState(false);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setIsPending(true);
      axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${codeResponse.access_token}`,
          },
        })
        .then(async ({ data: googleData }: AxiosResponse<GoogleRes>) => {
          const isExistingUser = await isExistingUserFn(googleData.email);

          if (isExistingUser.data.data) {
            setIsPending(false);
            saveUser(isExistingUser.data.data as User);
            navigate({ to: "/", search: { page: 1 } });
          } else {
            const registerResponse = await registerFn({
              name: googleData.name,
              email: googleData.email,
            });

            if (registerResponse.data.data) {
              setIsPending(false);
              navigate({ to: "/", search: { page: 1 } });
              setModal("COMPLETE_PROFILE", {
                isOpen: true,
                data: registerResponse.data.data,
              });
            }
          }
        });
    },
    onError: (error) => {
      setIsPending(false);
      toast.error("Something went wrong");
      console.log(error);
    },
  });

  return { loginWithGoogle, isPending };
};
