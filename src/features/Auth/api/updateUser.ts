import http from "@/config/https";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  userId: number;
  data: UpdateUserProps;
};

export type UpdateUserProps = {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  city?: string;
  state?: string;
  schoolName?: string;
  school_board?: string;
  publicationId?: string;
  seriesId?: string;
  distributor_name?: string;
  restrictedAccess: boolean;
  isProfileCompleted: boolean;
};

const mutationFn = ({ userId, data }: Props) => {
  return http.put(`/auth/update-details/${userId}`, data);
};

export const useUpdateUser = () => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const hideModal = useModalStore((state) => state.hideModal);

  return useMutation({
    mutationFn,
    onSuccess: ({ data }) => {
      updateUser(data.data);
      hideModal();
      toast.success("Updated Successfully");
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
