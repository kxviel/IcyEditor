import http from "@/config/https";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

type Props = {
  body: {
    phoneOrEmail: string;
    password: string;
  };
};

const loginFn = ({ body }: Props) => {
  return http.post("/auth/login", body);
};

export const useLoginFn = () => {
  const navigate = useNavigate();
  const { signIn, signOut } = useAuth();

  return useMutation({
    mutationFn: loginFn,
    onSuccess: ({ data }) => {
      toast.success(data.message);
      signIn(data.data);
      navigate({
        to: "/",
      });
    },
    onError: (err: string) => {
      toast.error(err);
      signOut();
    },
  });
};
