import { useGoogleLogin } from "@react-oauth/google";
import axios, { AxiosResponse } from "axios";
import { useIsExistingUser } from "./isExistingUser";
import { toast } from "sonner";

export type GoogleRes = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
};

export const useLoginWithGoogleFn = () => {
  const isExistingUser = useIsExistingUser();

  return useGoogleLogin({
    onSuccess: async (codeResponse) => {
      axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${codeResponse.access_token}`,
          },
        })
        .then(({ data }: AxiosResponse<GoogleRes>) => {
          isExistingUser.mutate(data);
        });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log(error);
    },
  });
};
