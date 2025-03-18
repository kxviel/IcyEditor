import http from "@/config/https";
import { useAuth, User } from "@/hooks/useAuth";
import { useModalStore } from "@/store/useModalStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

type Props = {
  phoneOrEmail: string;
  password: string;
};

interface LoginResponse {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: User;
}

const mutationFn = (body: Props) => {
  return http.post("/auth/login", body);
};

export const useLoginFn = () => {
  const navigate = useNavigate();
  const { saveUser } = useAuth();
  const setModal = useModalStore((state) => state.setModal);

  return useMutation({
    mutationFn,
    onSuccess: ({ data }: { data: LoginResponse }) => {
      toast.success(data.message);
      saveUser(data.data);
      navigate({ to: "/", search: { page: 1 } });

      if (!data.data.isProfileCompleted) {
        setModal("COMPLETE_PROFILE", {
          isOpen: true,
          data: data.data,
        });
      }
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
