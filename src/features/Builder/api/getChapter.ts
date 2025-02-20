import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Root {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: Chapter[];
}

export interface Chapter {
  id: number;
  STATUS: boolean;
  NAME: string;
  BOOK_ID: number;
}

const getChapterFn = (bookId: string): Promise<AxiosResponse<Root>> => {
  return http.get(`/services/chapters/${bookId}`);
};

export const useGetChapter = (bookId: string) => {
  return useQuery({
    queryKey: ["GetChapter", bookId],
    queryFn: () => getChapterFn(bookId),
    select: ({ data }) => data.data,
    enabled: !!bookId,
  });
};
