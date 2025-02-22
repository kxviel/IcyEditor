import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Root {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: Series[];
}

export interface Series {
  id: number;
  STATUS: boolean;
  NAME: string;
  CODE: string;
}

const getSeriesFn = (publicationId: string): Promise<AxiosResponse<Root>> => {
  return http.get(`/services/series/${publicationId}`);
};

export const useGetSeries = (publicationId: string) => {
  return useQuery({
    queryKey: ["GetSeries", publicationId],
    queryFn: () => getSeriesFn(publicationId),
    select: ({ data }) => data.data,
    enabled: !!publicationId,
  });
};
