import http from "@/config/https";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { DateRange } from "react-day-picker";

export interface Root {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: Data;
}

interface Data {
  total: number;
  examData: ExamDaum[];
}

interface ExamDaum {
  EXAM_NAME: string;
  Class_NAME: string;
  Duration_in_mins: number;
  ID: number;
  Subject_Name: string;
  date: string;
}

type Props = {
  page: number;
  userId?: number;
  order?: string;
  searchTerm?: string;
  date?: DateRange | undefined;
};

export const getPapersFn = (props: Props): Promise<AxiosResponse<Root>> => {
  const { page, userId, order, searchTerm, date } = props;
  const params: any = {
    page: page || 1,
    pageSize: 10,
    sortBy: "EXAM_NAME",
  };

  if (order) params.order = order;
  if (searchTerm) params.searchTerm = searchTerm;
  if (date && date.from && date.to) {
    params.startDate = date.from.toISOString();
    params.endDate = date.to.toISOString();
  }

  return http.get(`/questionbank/getUserExamPaperDetails/${userId}`, {
    params,
  });
};

export const useGetPapers = (props: Props) => {
  const getUser = useAuthStore((state) => state.getUser);
  const user = getUser();

  return useQuery({
    queryKey: ["GetPapers", props, user?.id],
    queryFn: () => getPapersFn({ ...props, userId: user?.id }),
    select: ({ data }) => data.data,
  });
};
