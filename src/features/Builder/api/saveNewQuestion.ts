import http from "@/config/https";
import { queryClient } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  body: {
    ANSWER_DATA: string;
    CATEGORY_ID: number;
    CHAPTER_ID: number;
    FILE_ID: number;
    QUESTION_DATA: string;
    REASON: string;
    REMARKS: string;
    STAGE: string;
    type: string;
  };
};

const mutationFn = ({ body }: Props) => {
  return http.post("/questionbank", body);
};

export const useSaveNewQuestion = () => {
  return useMutation({
    mutationFn,
    onSuccess: ({ data }) => {
      toast.success(data.message);
      queryClient.refetchQueries({ queryKey: ["GetQuestionList"] });
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
