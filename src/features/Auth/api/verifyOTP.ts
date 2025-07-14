import http from "@/config/https";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

type Props = {
  body: {
    phoneOrEmail: string;
    otp: string;
    newPassword: string;
  };
};

const verifyOTPFn = ({ body }: Props) => {
  return http.post("/auth/verify-otp-and-reset-password", body);
};

export const useVerifyOTPFn = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: verifyOTPFn,
    onSuccess: () => {
      toast.success("OTP Verified & Password Reset Successfully");
      navigate({ to: "/login" });
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
