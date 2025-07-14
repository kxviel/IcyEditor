import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Root {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: Publication[];
}

export interface Publication {
  id: number;
  STATUS: boolean;
  CODE: string;
  NAME: string;
}

const getPublicationFn = (): Promise<AxiosResponse<Root>> => {
  return http.get("/services/publications");
};

export const useGetPublication = () => {
  return useQuery({
    queryKey: ["GetPublication"],
    queryFn: () => getPublicationFn(),
    select: ({ data }) => data.data,
  });
};
