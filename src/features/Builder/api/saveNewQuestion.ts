import http from "@/config/https";
import { useModalStore } from "@/store/useModalStore";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  questionId: number;
  ANSWER_DATA: string;
  CATEGORY_ID: number;
  CHAPTER_ID: number;
  FILE_ID: number;
  QUESTION_DATA: string;
  // MARKS_DISTRIBUTION: string;
  PUBLICATIONS: string;
  SERIES: string;
  CLASS_NAME: string;
  BOOK: number;
  REASON: string | null;
  REMARKS: string | null;
  STAGE: string | null;
  type: string | null;
};

interface SaveQuestionResponse {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: SaveQuestionData;
}

interface SaveQuestionData {
  status: boolean;
  ANSWER_DATA: string;
  CATEGORY_ID: number;
  CHAPTER_ID: number;
  FILE_ID: number;
  QUESTION_DATA: string;
  REASON: any;
  REMARKS: any;
  STAGE: any;
  type: any;
  id: number;
}

const mutationFn = (body: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { questionId, ...bodyWithoutId } = body;
  return http.post("/questionbank/add/question", bodyWithoutId);
};

export const useSaveNewQuestion = () => {
  const hideModal = useModalStore((state) => state.hideModal);
  const editQuestion = useQuestionBuilderStore((state) => state.editQuestion);

  return useMutation({
    mutationFn,
    onSuccess: ({ data }: { data: SaveQuestionResponse }, variables) => {
      toast.success(data.message);

      editQuestion(
        variables.CATEGORY_ID?.toString(),
        variables.questionId,
        data.data.id,
        data.data.QUESTION_DATA,
      );

      hideModal();
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
