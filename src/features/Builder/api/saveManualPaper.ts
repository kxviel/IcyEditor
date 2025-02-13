import http from "@/config/https";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  body: {
    chapterId: number;
    questionIds: number[];
  };
};

const mutationFn = ({ body }: Props) => {
  return http.post("/questionbank/manual", body);
};

export const useSaveManualPaper = () => {
  return useMutation({
    mutationFn,
    onSuccess: ({ data }) => {
      toast.success(data.message);
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
