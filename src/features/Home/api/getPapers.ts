import http from "@/config/https";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export interface Root {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: Data;
}

export interface Data {
  examData: any[];
  total: number;
  page: string;
  pageSize: string;
}

type Props = {
  page?: number;
  search?: string;
  userId?: number;
};

export const getPapersFn = (props: Props): Promise<AxiosResponse<Root>> => {
  const params: any = {
    size: 10,
  };

  const { page, search, userId } = props;

  if (page) params.page = page;
  if (search) params.search = search;

  if (!userId) {
    throw new Error("User ID is required");
  }

  return http.get(`/questionbank/exam/${userId}`, {
    params,
  });
};

export const useGetPapers = (props: Props) => {
  const { getUser } = useAuth();
  const userData = getUser();

  return useQuery({
    queryKey: ["GetPapers", props, userData?.id],
    queryFn: () => getPapersFn({ ...props, userId: userData?.id }),
    select: ({ data }) => data.data,
    enabled: !!props?.page && !!userData?.id,
  });
};
