import http from "@/config/https";
import { useMutation } from "@tanstack/react-query";
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
    PUBLICATIONS: string;
    SERIES: string;
    BOOK: string;
    CHAPTER_IDS: string[];
    examClassId: string;
    subjectId: string;
  };
};

interface DataString {
  questionIds: number[];
}

const mutationFn = ({ body }: Props) => {
  return http.post("/questionbank/exam", body);
};

export const useSaveExamPaper = () => {
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
