import http from "@/config/https";
import { useAuth } from "@/hooks/useAuth";
import { useModalStore } from "@/store/useModalStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

type Props = {
  body: {
    name: string;
    email: string;
    password?: string;
  };
  isGoogleAuth?: boolean;
};

const registerFn = (data: Props) => {
  return http.post("/auth/register", data.body);
};

export const useRegisterFn = () => {
  const navigate = useNavigate();
  const setModal = useModalStore((state) => state.setModal);
  const { signIn, signOut } = useAuth();

  return useMutation({
    mutationFn: registerFn,
    onSuccess: ({ data }, { isGoogleAuth }) => {
      toast.success(data.message);
      signIn(data.data);

      if (isGoogleAuth) {
        setModal("COMPLETE_PROFILE", {
          isOpen: true,
          data: data.data,
        });
      } else {
        navigate({
          to: "/",
        });
      }
    },
    onError: (err: string) => {
      toast.error(err);
      signOut();
    },
  });
};
