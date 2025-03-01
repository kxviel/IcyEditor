import http from "@/config/https";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  body: {
    phoneOrEmail: string;
  };
};

const sendOTPFn = ({ body }: Props) => {
  return http.post("/auth/send-otp", body);
};

export const useSendOTPFn = () => {
  return useMutation({
    mutationFn: sendOTPFn,
    onSuccess: () => {
      toast.success("OTP Sent to your email");
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
