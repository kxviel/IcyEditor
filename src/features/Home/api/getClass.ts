import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type Class = {
  id: number;
  STATUS: string;
  NAME: string;
  SERIES_ID: number;
};

type Props = {
  parentValue: string;
};

const getClassFn = ({
  parentValue,
}: Props): Promise<AxiosResponse<[Class]>> => {
  const params = {
    type: "load_class",
    parent_value: parentValue,
  };

  return http.get("/get_data", {
    params,
  });
};

export const useGetClass = ({ parentValue }: Props) => {
  return useQuery({
    queryKey: ["GetClass", parentValue],
    queryFn: () => getClassFn({ parentValue }),
    select: ({ data }) => data,
  });
};
