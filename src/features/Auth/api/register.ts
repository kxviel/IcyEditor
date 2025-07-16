import http from "@/config/https";
import { useAuthStore, User } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

type Props = {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  city?: string;
  state?: string;
  schoolName?: string;
  school_board?: string;
  publicationId?: string;
  seriesId?: string;
  distributor_name?: string;
};

interface RegisterResponse {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: User;
}

const mutationFn = (body: Props) => {
  return http.post("/auth/register", body);
};

export const useRegisterFn = () => {
  const navigate = useNavigate();
  const saveUser = useAuthStore((state) => state.saveUser);

  return useMutation({
    mutationFn,
    onSuccess: ({ data }: { data: RegisterResponse }) => {
      toast.success(data.message);
      saveUser(data.data);
      navigate({
        to: "/",
        search: { page: 1 },
      });
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
