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

// export const useGetQuestionTitles = (
//   chapterId: string,
// ): { isPending: boolean; data: ChapterTitles[] } => {
//   if (chapterId) {
//     return {
//       isPending: false,
//       data: [
//         {
//           id: 17,
//           category_name: "Match the following.",
//         },
//         {
//           id: 10983,
//           category_name: "Tick ✓ the correct answer. (MCQs)",
//         },
//         {
//           id: 38,
//           category_name: "Fill in the blanks using the suitable words.",
//         },
//         {
//           id: 11112,
//           category_name: "Answer the following questions in brief.",
//         },
//         {
//           id: 27,
//           category_name: "Answer the following questions in detail.",
//         },
//         {
//           id: 11086,
//           category_name: "Write 'T' for true and 'F' for false statements.",
//         },
//       ],
//     };
//   } else {
//     return {
//       isPending: false,
//       data: [],
//     };
//   }
// };
