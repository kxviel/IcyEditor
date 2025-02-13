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
  totalQuestions: number;
  questions: ChapterTitles[];
}

export interface ChapterTitles {
  id: number;
  category_name: string;
}

// const getQuestionTitlesFn = (
//   chapterId: string,
// ): Promise<AxiosResponse<Root>> => {
//   return http.get(`/questionbank/chapter/${chapterId}`);
// };

// export const useGetQuestionTitles = (chapterId: string) => {
//   return useQuery({
//     queryKey: ["GetQuestionTitles", chapterId],
//     queryFn: () => getQuestionTitlesFn(chapterId),
//     select: ({ data }) => data.data,
//     enabled: !!chapterId,
//   });
// };

export const useGetQuestionTitles = (
  chapterId: string,
): { isPending: boolean; data: ChapterTitles[] } => {
  if (chapterId) {
    return {
      isPending: false,
      data: [
        {
          id: 17,
          category_name: "Match the following.",
        },
        {
          id: 10983,
          category_name: "Tick ✓ the correct answer. (MCQs)",
        },
        {
          id: 38,
          category_name: "Fill in the blanks using the suitable words.",
        },
        {
          id: 11112,
          category_name: "Answer the following questions in brief.",
        },
        {
          id: 27,
          category_name: "Answer the following questions in detail.",
        },
        {
          id: 11086,
          category_name: "Write 'T' for true and 'F' for false statements.",
        },
      ],
    };
  } else {
    return {
      isPending: false,
      data: [],
    };
  }
};
