import http from "@/config/https";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

type Props = {
  body: {
    name: string;
    email: string;
    password?: string;
  };
};

const registerFn = ({ body }: Props) => {
  return http.post("/auth/register", body);
};

export const useRegisterFn = () => {
    const navigate = useNavigate();
    const { signIn, signOut } = useAuth();
    
  return useMutation({
    mutationFn: registerFn,
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
