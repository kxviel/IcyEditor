import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";

type Props = {
  parentValue: string;
};

const getSeriesFn = ({ parentValue }: Props) => {
  let params: any = {
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
    select: ({ data }) => data.data,
  });
};
