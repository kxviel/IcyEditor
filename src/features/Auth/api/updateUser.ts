import http from "@/config/https";
import { useAuth } from "@/hooks/useAuth";
import { useModalStore } from "@/store/useModalStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  body: {
    userId: number;
    data: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
      phone: string;
      // city: string;
      state: string;
      school: string;
    };
  };
};

const mutationFn = ({ body }: Props) => {
  return http.put(`/auth/update-details/${body.userId}`, body);
};

export const useUpdateUser = () => {
  const { signIn } = useAuth();
  const hideModal = useModalStore((state) => state.hideModal);

  return useMutation({
    mutationFn,
    onSuccess: ({ data }) => {
      signIn(data.data);
      hideModal();
      toast.success("Updated Successfully");
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
