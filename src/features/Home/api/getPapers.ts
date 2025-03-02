import http from "@/config/https";
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
  userId: number;
  order?: string;
  searchTerm?: string;
  date?: DateRange | undefined;
};

export const getPapersFn = (props: Props): Promise<AxiosResponse<Root>> => {
  const params: any = {
    pageSize: 10,
    sortBy: "EXAM_NAME",
  };

  const { page, userId, order, searchTerm, date } = props;

  if (page) params.page = page;
  if (order) params.order = order;
  if (searchTerm) params.searchTerm = searchTerm;
  if (date && date.from && date.to) {
    params.fromDate = date.from.toISOString();
    params.toDate = date.to.toISOString();
  }

  return http.get(`/questionbank/getUserExamPaperDetails/${userId}`, {
    params,
  });
};

export const useGetPapers = (props: Props) => {
  return useQuery({
    queryKey: ["GetPapers", props],
    queryFn: () => getPapersFn(props),
    select: ({ data }) => data.data,
    enabled: !!props?.page && !!props?.userId,
  });
};
