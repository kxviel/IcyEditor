import http from "@/config/https";
import { queryClient } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  body: {
    id: number;
  };
};

const mutationFn = ({ body }: Props) => {
  return http.delete(`/questionbank/exam/${body.id}`);
};

export const useDeletePaper = () => {
  return useMutation({
    mutationFn,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["GetPapers"] });
      toast.success(data.message);
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
