import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type Series = {
  id: number;
  STATUS: string;
  CODE: string;
  NAME: string;
  PUBLICATION_ID: number;
};

type Props = {
  parentValue: string;
};

const getSeriesFn = ({
  parentValue,
}: Props): Promise<AxiosResponse<[Series]>> => {
  const params = {
    type: "load_series",
    parent_value: parentValue,
  };

  return http.get("/get_data", {
    params,
  });
};

export const useGetSeries = ({ parentValue }: Props) => {
  return useQuery({
    queryKey: ["GetSeries", parentValue],
    queryFn: () => getSeriesFn({ parentValue }),
    select: ({ data }) => data,
  });
};
