import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Root {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: ExamData;
}

export interface ExamData {
  examId: string;
  type: string;
  totalQuestions: number;
  selectedQuestions: number;
  categories: Category[];
  originalData: OriginalData;
  examClassId: number;
  subjectId: number;
  id: number;
  STATUS: boolean;
  CLASS_NAME: string;
  DURATION_MINS: number;
  EXAM_NAME: string;
  DATA_STRING: string;
  SCHOOL_NAME: string;
  SUBJECT_NAME: string;
  USER_ID: number;
  createdAt: string;
  updatedAt: string;
  LAYOUT: string;
  PAGE_COUNT: any;
  TYPE: any;
  FONT: string;
  MARKS: number;
  MARKS_DISTRIBUTION: string;
  PUBLICATIONS: string;
  SERIES: string;
  BOOK: number;
  CHAPTER_IDS: string[];
}

export interface Category {
  categoryId: string;
  categoryName: string;
  questions: Question[];
  questionCount: number;
  selectedCount: number;
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
  isSelected: boolean;
}

export interface OriginalData {
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
    enabled: !["manual-selection", "auto-selection"].includes(examId),
  });
};
