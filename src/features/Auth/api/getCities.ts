import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Root {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: City[];
}

export interface City {
  id: number;
  STATUS: boolean;
  NAME: string;
}

const getCitiesFn = (stateId: string): Promise<AxiosResponse<Root>> => {
  return http.get(`/services/cities/${stateId}`);
};

export const useGetCities = (stateId: string) => {
  return useQuery({
    queryKey: ["GetCities", stateId],
    queryFn: () => getCitiesFn(stateId),
    select: ({ data }) => data.data,
  });
};
