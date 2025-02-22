import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Root {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: Book[];
}

export interface Book {
  id: number;
  STATUS: boolean;
  NAME: string;
  SUBJECT_ID: number;
}

const getBookFn = (subjectId: string): Promise<AxiosResponse<Root>> => {
  return http.get(`/services/books/${subjectId}`);
};

export const useGetBook = (subjectId: string) => {
  return useQuery({
    queryKey: ["GetBook", subjectId],
    queryFn: () => getBookFn(subjectId),
    select: ({ data }) => data.data,
    enabled: !!subjectId,
  });
};
