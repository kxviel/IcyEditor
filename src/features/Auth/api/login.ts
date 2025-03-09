import http from "@/config/https";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

type Props = {
  phoneOrEmail: string;
  password: string;
};

const mutationFn = (body: Props) => {
  return http.post("/auth/login", body);
};

export const useLoginFn = () => {
  const navigate = useNavigate();
  const { saveUser } = useAuth();

  return useMutation({
    mutationFn,
    onSuccess: ({ data }) => {
      toast.success(data.message);
      saveUser(data.data);
      navigate({
        to: "/",
      });
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
