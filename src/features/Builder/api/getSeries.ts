import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type Series = {
  id: number;
  STATUS: string | null;
  CODE: string;
  NAME: string;
  PUBLICATION_ID: number;
};

type Props = {
  parentValue: string;
};

const getSeriesFn = ({
  parentValue,
}: Props): Promise<AxiosResponse<Series[]>> => {
  const params = {
    type: "load_series",
    parent_value: parentValue,
  };

  return http.get("/get_data", {
    params,
  });
};

export const useGetSeries = ({
  parentValue,
}: Props): { isPending: boolean; data: Series[] } => {
  // return useQuery({
  //   queryKey: ["GetSeries", parentValue],
  //   queryFn: () => getSeriesFn({ parentValue }),
  //   select: ({ data }) => data,
  // });

  if (parentValue) {
    return {
      isPending: false,
      data: [
        {
          id: 2,
          STATUS: "1",
          CODE: "MOBO",
          NAME: "MonoPoly Books",
          PUBLICATION_ID: 2,
        },
      ],
    };
  } else {
    return { isPending: false, data: [] };
  }
};
