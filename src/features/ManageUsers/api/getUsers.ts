import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Root {
  code: string;
  message: string;
  statusCode: number;
  success: boolean;
  data: UserRoot;
}

interface UserRoot {
  total: number;
  page: number;
  pageSize: number;
  data: UserData[];
}

export interface UserData {
  id: number;
  STATUS?: string;
  DEALER_ID?: string;
  EMAIL: string;
  PASSWORD: string;
  MOBILE?: string;
  SCHOOL_ID: string;
  UNAME: string;
  school: any;
  city: any;
  state: any;
  PUBLICATION_ID: any;
  SERIES_ID: any;
  IS_SUPER_ADMIN: number;
  RESTRICTED_ACCESS: number;
}

type Props = {
  page: number;
  mobile?: number;
  email?: string;
  search?: string;
};

const getUsersFn = (props: Props): Promise<AxiosResponse<Root>> => {
  const params: any = {
    pageSize: 10,
  };

  const { page, mobile, email, search } = props;

  if (page) params.page = page;
  if (search) params.search = search;
  if (mobile) params.mobile = mobile;
  if (email) params.email = email;

  return http.get(`/services/get/all/users`, { params });
};

export const useGetUsers = (props: Props) => {
  return useQuery({
    queryKey: ["GetUsers", props],
    queryFn: () => getUsersFn(props),
    select: ({ data }) => data.data,
  });
};
