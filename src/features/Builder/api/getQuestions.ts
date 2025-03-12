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

const getQuestionsFn = (chapterIds: string[]): Promise<AxiosResponse<Root>> => {
  return http.post(`/questionbank/chapters/bulk`, { chapterIds });
};

export const useGetQuestions = (chapterIds: string[]) => {
  return useQuery({
    queryKey: ["GetQuestionList", chapterIds],
    queryFn: () => getQuestionsFn(chapterIds),
    select: ({ data }) => data.data,
    // enabled: chapterIds.length > 0,
  });
};
