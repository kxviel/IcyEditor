import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Root {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: Data;
}

interface Data {
  examId: string;
  type: string;
  totalQuestions: number;
  selectedQuestions: number;
  categories: Category[];
  originalData: OriginalData;
}

interface Category {
  categoryId: string;
  categoryName: string;
  questions: Question[];
  questionCount: number;
  selectedCount: number;
}

interface Question {
  id: number;
  status: any;
  ANSWER_DATA: any;
  CATEGORY_ID: string;
  CHAPTER_ID: number;
  FILE_ID: any;
  QUESTION_DATA: string;
  REASON: any;
  REMARKS: any;
  STAGE: any;
  type: any;
  isSelected: boolean;
}

interface OriginalData {
  questionIds: number[];
}

const getExamByIdFn = (examId: string): Promise<AxiosResponse<Root>> => {
  return http.get(`/questionbank/getExamPaperDetailsById/${examId}`);
};

export const useGetExamById = (examId: string) => {
  return useQuery({
    queryKey: ["GetExamById", examId],
    queryFn: () => getExamByIdFn(examId),
    select: ({ data }) => data.data,
    enabled: !["manual", "auto"].includes(examId),
  });
};
