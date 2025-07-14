import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Root {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: Subject[];
}

export interface Subject {
  id: number;
  STATUS: boolean;
  NAME: string;
  CLASS_ID: string;
}

const getSubjectFn = (classId: string): Promise<AxiosResponse<Root>> => {
  return http.get(`/services/subjects/${classId}`);
};

export const useGetSubject = (classId: string) => {
  return useQuery({
    queryKey: ["GetSubject", classId],
    queryFn: () => getSubjectFn(classId),
    select: ({ data }) => data.data,
    enabled: !!classId,
  });
};
