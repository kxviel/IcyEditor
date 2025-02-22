import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Root {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: Class[];
}

export interface Class {
  id: number;
  STATUS: boolean;
  NAME: string;
}

const getClassFn = (seriesId: string): Promise<AxiosResponse<Root>> => {
  return http.get(`/services/exam-class/${seriesId}`);
};

export const useGetClass = (seriesId: string) => {
  return useQuery({
    queryKey: ["GetClass", seriesId],
    queryFn: () => getClassFn(seriesId),
    select: ({ data }) => data.data,
    enabled: !!seriesId,
  });
};
