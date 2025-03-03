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

export interface Data {
  type: string;
  totalQuestions: number;
  categories: Category[];
}

export interface Category {
  categoryId: string;
  categoryName: string;
  questions: Question[];
  questionCount: number;
}

export interface Question {
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
}

const getQuestionFn = (chapterId: string): Promise<AxiosResponse<Root>> => {
  return http.get(`/questionbank/chapter/${chapterId}`);
};

export const useGetQuestionList = (chapterId: string) => {
  return useQuery({
    queryKey: ["GetQuestionList", chapterId],
    queryFn: () => getQuestionFn(chapterId),
    select: ({ data }) => data.data,
    enabled: !!chapterId,
  });
};
