import http from "@/config/https";
import { useHeaderStore } from "@/store/useHeaderStore";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

type Props = {
  body: {
    CLASS_NAME: string;
    DURATION_MINS: string;
    EXAM_NAME: string;
    DATA_STRING: DataString;
    SCHOOL_NAME: string;
    SUBJECT_NAME: string;
    USER_ID: number;
    LAYOUT: string;
    MARKS: string;
    FONT: string;
    // STATUS: boolean;
    // PAGE_COUNT: number;
    // TYPE: string;
  };
};

interface DataString {
  questionIds: number[];
}

const mutationFn = ({ body }: Props) => {
  return http.post("/questionbank/exam", body);
};

export const useSaveExamPaper = () => {
  const navigate = useNavigate();
  const resetHeader = useHeaderStore((state) => state.reset);
  const resetBuilder = useQuestionBuilderStore((state) => state.reset);
  const resetPageSettings = usePageSettingsStore((state) => state.reset);

  return useMutation({
    mutationFn,
    onSuccess: ({ data }) => {
      toast.success(data.message);
      resetHeader();
      resetBuilder();
      resetPageSettings();

      navigate({ to: "/" });
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
