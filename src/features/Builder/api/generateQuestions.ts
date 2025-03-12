import http from "@/config/https";
import { parseAutoGenResponse } from "@/lib/utils";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AxiosResponse } from "axios";
import { toast } from "sonner";

interface Root {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: AutoGenData;
}

export interface AutoGenData {
  type: string;
  totalQuestions: number;
  categories: Category[];
}

interface Category {
  categoryId: string;
  categoryName: string;
  questions: Question[];
  questionCount: number;
}

interface Question {
  id: number;
  status: any;
  ANSWER_DATA: string;
  CATEGORY_ID: string;
  CHAPTER_ID: number;
  FILE_ID: any;
  QUESTION_DATA: string;
  REASON: any;
  REMARKS: any;
  STAGE: any;
  type: string;
}

type Props = {
  chapterIds: number[];
  questionCount: number;
};

const mutationFn = (body: Props): Promise<AxiosResponse<Root>> => {
  return http.post("/questionbank/auto", body);
};

export const useGenerateQuestions = () => {
  const navigate = useNavigate();
  const presetFields = useQuestionBuilderStore((state) => state.presetFields);

  const handlePreset = (examData: AutoGenData) => {
    if (examData && examData.categories) {
      const parsedObject = parseAutoGenResponse(examData);
      console.log(parsedObject);

      if (parsedObject.fields) {
        presetFields(parsedObject.fields);
        navigate({ to: "/builder/$examId", params: { examId: "auto" } });
      }
    }
  };

  return useMutation({
    mutationFn,
    onSuccess: ({ data }) => {
      toast.success(data.message);
      handlePreset(data.data);
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};
