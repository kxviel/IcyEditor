import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Root {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: State[];
}

export interface State {
  id: number;
  STATUS: boolean;
  NAME: string;
}

const getStatesFn = (): Promise<AxiosResponse<Root>> => {
  return http.get("/services/cities");
};

export const useGetStates = () => {
  return useQuery({
    queryKey: ["GetStates"],
    queryFn: () => getStatesFn(),
    select: ({ data }) => data.data,
  });
};
