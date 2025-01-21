import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type Class = {
  id: number;
  STATUS: string | null;
  SERIES_ID: number;
  NAME: string;
};

type Props = {
  parentValue: string;
};

const getClassFn = ({
  parentValue,
}: Props): Promise<AxiosResponse<Class[]>> => {
  const params = {
    type: "load_class",
    parent_value: parentValue,
  };

  return http.get("/get_data", {
    params,
  });
};

export const useGetClass = ({
  parentValue,
}: Props): { isPending: boolean; data: Class[] } => {
  // return useQuery({
  //   queryKey: ["GetClass", parentValue],
  //   queryFn: () => getClassFn({ parentValue }),
  //   select: ({ data }) => data,
  // });

  if (parentValue) {
    return {
      isPending: false,
      data: [
        {
          id: 9,
          STATUS: "1",
          NAME: "Class 1",
          SERIES_ID: 2,
        },
        {
          id: 10,
          STATUS: "1",
          NAME: "Class 2",
          SERIES_ID: 2,
        },
        {
          id: 11,
          STATUS: "1",
          NAME: "Class 3",
          SERIES_ID: 2,
        },
        {
          id: 12,
          STATUS: "1",
          NAME: "Class 4",
          SERIES_ID: 2,
        },
        {
          id: 13,
          STATUS: "1",
          NAME: "Class 5",
          SERIES_ID: 2,
        },
        {
          id: 14,
          STATUS: "1",
          NAME: "Class 6",
          SERIES_ID: 2,
        },
        {
          id: 15,
          STATUS: "1",
          NAME: "Class 7",
          SERIES_ID: 2,
        },
        {
          id: 16,
          STATUS: "1",
          NAME: "Class 8",
          SERIES_ID: 2,
        },
        {
          id: 22,
          STATUS: "1",
          NAME: "Nursery",
          SERIES_ID: 2,
        },
        {
          id: 23,
          STATUS: "1",
          NAME: "L.K.G.",
          SERIES_ID: 2,
        },
        {
          id: 24,
          STATUS: "1",
          NAME: "U.K.G.",
          SERIES_ID: 2,
        },
      ],
    };
  } else {
    return {
      isPending: false,
      data: [],
    };
  }
};
